/*
 * prefix: 
 * al アルファベット
 * bo 母音
 * si 子音
 * sp y, hなど子音と母音の間に入る音
 * hi 平仮名
 * ka カタカナ
 */
(function(define, table) {
  var table = table;
  define([], function() {
    var hasProp = Object.prototype.hasOwnProperty,
        slice =Array.prototype.slice, 
        _migemoge = {
          // 正規化
          toRegExp: toRegExp,
          // 確定していないアルファベット
          pending: "",
          // 確定していないアルファベットをクリアする
          clearPending: clearPending,
          separateWrapper: separateWrapper,
          // アルファベットを日本語の音で分ける
          separate: separate,
          // 音で区切ったアルファベットの配列をを平仮名の文字列に変換
          roma2hira: roma2hira,
          // 平仮名をカタカナに変換
          hira2kata: hira2kata
        },
        // インターフェース
        migemoge = {
          // モジュール名
          name: "Migemoge",
          // 実行
          exec: function() {
            return exec.apply(_migemoge, slice.call(arguments));
          }
        };

    return function() {
      return (function () {
        // 初期化
        this.pending = "";
        var i, l;
        for (i = 0, l = table.al_boin.length; i < l; i++) {
          table.boin[table.al_boin[i]] = table.hi_boin[i];
        }
        return migemoge;
      }).call(_migemoge)
    };

    // --- 実装 ---
    /*
     * @memberof migemoge
     */
    function exec(str) {
      this.clearPending();
      return this.roma2hira(this.separateWrapper(str));
    }

    /*
     * @memberof _migemoge
     */
    function separateWrapper(str) {
      var separatedAry = [],
          i, l;
      for (i = 0, l = str.length; i < l; i++) {
        separated = this.separate(str[i], ((l-i) === 1));
        if (separated) separatedAry[separatedAry.length] = separated;
      }
      return separatedAry;
    }

    /*
     * @memberOf _migemoge
     */
    function separate(input, isLast) {
      var res = false,
          _pending = this.pending;
      // 母音が渡ってきたとき
      if (table.al_boin.indexOf(input) !== -1) {
        this.clearPending();
        return (_pending) ? _pending + input : input;
      // 子音が渡ってきたとき
      } else {
        // 既に未確定の子音がないとき
        if (!_pending) {
          this.pending = input;
          return;
        // 未確定の子音があるとき
        } else {
          // specialTableが使える
          if (hasProp.call(table.special, input) && hasProp.call(table.special[input], _pending)) {
            if (isLast) {
              return _pending + input;
            } else if (input === _pending) {
              this.pending = (_pending === "n") ? "" : input;
              return _pending + input;
            } else {
              this.pending = _pending + input;
              return;
            }
          // specialTableが使えない
          } else {
            if (input === _pending) {
              // _pending{n}, input{n}であれば, this.pendingクリアして, _pending + inputを返す.
              // n以外の値xとすると, _pending{x}, input{x}, this.pendingにxを入れて, _pending + inputを返す.
              this.pending = (_pending === "n") ? "" : input;
              return _pending + input;
            } else {
              this.pending = input;
              // nが確定していない値としてセットされている場合(nk, nn)とそれ以外の場合(不正な場合)(e.g. kn, kv)
              return (_pending === "n") ? (_pending + _pending) : "";
            }
          }
        }
      }
    }

    /*
     * @memberOf _migemoge
     */
    function roma2hira(romaAry) {
      var res = [], i, l, roma, hira;
      // 未確定の値が残っていた場合は評価に加える
      if (this.pending) romaAry[romaAry.length] = this.pending;

      for (i=0, l=romaAry.length; i<l; i++) {
        roma = romaAry[i];

        if (roma.length === 1) {
          // 母音
          if (table.al_boin.indexOf(roma[0]) !== -1) {
            hira = table.boin[roma[0]];
          // ラスト未確定の子音
          } else if ((l-i) === 1 && hasProp.call(table.shiin, roma[0])) {
            hira = table.shiin[roma[0]].split("");
          } else {
            hira = "";
          }
        } else if (roma.length === 2) {
          // ラスト未確定のspecialTable (e.g. ky, by)
          if (hasProp.call(table.special, roma[1]) &&
              hasProp.call(table.special[roma[1]], roma[0])) {
            hiraAry = [];
            for (key in table.special[roma[1]][roma[0]]) {
              if (!hasProp.call(table.special[roma[1]][roma[0]], key)) continue;
              hiraAry[arry.length] = table.special[roma[1]][roma[0]][key];
            }
            hira = hiraAry;
          } else {
            hira = (table.al_boin.indexOf(roma[1]) !== -1) ? 
                     table.shiin[roma[0]][table.al_boin.indexOf(roma[1])] :
                   (roma[0] === roma[1]) ? 
                     table.shiin[roma[0]][table.al_boin.length] :
                   "";
          }
        } else if (roma.length === 3) {
          hira = hasProp.call(table.special[roma[1]][roma[0]], roma[2]) ?
                   table.special[roma[1]][roma[0]][roma[2]] :
                 ""
        } else {
          hira = "";
        }
        res[res.length] = this.toRegExp(hira, roma);
      }
      return "(" + res.join(")(") + ")";
    }

    /*
     * @memberOf _migemoge
     */
    function hira2kata(hira) {
      var i, c, a = [];
      for(i=hira.length-1;0<=i;i--) {
          c = hira.charCodeAt(i);
          a[i] = (0x3041 <= c && c <= 0x3096) ? c + 0x0060 : c;
      };
      return String.fromCharCode.apply(null, a);
    }

    /*
     * @memberOf _migemoge
     */
    function clearPending() {
      this.pending = "";
    }

    /*
     * @memberOf _migemoge
     */
    function toRegExp(_hira, roma) {
      var hira = "";
      // 平仮名変換時にkki = > ['kk', 'ki'] として扱っているが,
      // 元のローマ字 kkiにもマッチさせるため
      if (roma.length === 2 && roma[0] === roma[1]) roma += "|" + roma[0];
      hira = (is("Array", _hira)) ? _hira.join("|") : _hira;
      return roma + "|" + hira + "|" + this.hira2kata(hira);
    }

    // --- Utility用のメソッド ---
    /*
     * オブジェクトのタイプを確かめる
     */
    function is(type, obj) {
      if (type === "Number") return (obj === +obj); // こっちのほうが高速なので
      if (type === "undefined") return (typeof obj === "undefined");

      // [Object String] の'[Object ' と ']' を取り除くためにsliceしている
      var clas = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== null && clas === type;
    }
  });
})(
  // 第一引数 define
  // RequireJSとかでdefine使える時
  typeof define !== 'undefined' ? define :
  // RequireJSとかでdefine使えず, Nodeとかでmodule.expotsが使えるとき
  (typeof module !== 'undefined') ? function(deps, factory) {
    module.exports = factory();
  } :
  // defineもmoduleも使えないとき現在のコンテキストに入れる
  function(deps, factory) {
    var module = factory();
    this[module.name] = module;
  },
  // 第二引数 table コードの先頭にあると見通し悪いとおもったので
  {
    // 母音のアルファベットの配列
    al_boin: "aiueo",
    // 母音の平仮名の配列
    hi_boin: "あいうえお",
    // 母音のアルファベットをキーとした平仮名のオブジェクト
    boin: {},
    // 子音のアルファベットをキーとした平仮名のオブジェクト
    shiin: {
      l: "ぁぃぅぇぉ", x: "ぁぃぅぇぉ",
      c: "かしくせこっ", k: "かきくけこっ", s: "さしすせそっ",
      t: "たちつてとっ", n: "なにぬねのん", h: "はひふへほっ",
      m: "まみむめもっ", r: "らりるれろっ", g: "がぎぐげごっ",
      z: "ざしずぜぞっ", d: "だぢづでどっ", b: "ばびぶべぼっ",
      p: "ぱぴぷぺぽっ",
      q: ["くぁ", "くぃ", "く", "くぇ", "くぉ"],
      w: ["わ", "うぃ", "う", "うぇ", "を", "っ"],
      j: ["じゃ", "じ", "じゅ", "じぇ", "じょ"],
      v: ["ヴぁ", "ヴぃ", "ヴ", "ヴぇ", "ヴぉ"]
    },
    // 3つのアルファベットから生成される平仮名のオブジェクト
    special: {
      y: {
        l: {a:"ゃ", u:"ゅ", o:"ょ"},
        x: {a:"ゃ", u:"ゅ", o:"ょ"},
        k: {a: "きゃ", u: "きゅ", o: "きょ"},
        s: {a: "しゃ", u: "しゅ", o: "しょ"},
        t: {a: "ちゃ", u: "ちゅ", o: "ちょ"},
        c: {a: "ちゃ", u: "ちゅ", o: "ちょ"},
        n: {a: "にゃ", u: "にゅ", o: "にょ"},
        h: {a: "ひゃ", u: "ひゅ", o: "ひょ"},
        n: {a: "にゃ", u: "にゅ", o: "にょ"},
        m: {a: "みゃ", u: "みゅ", o: "みょ"},
        r: {a: "りゃ", u: "りゅ", o: "りょ"},
        g: {a: "ぎゃ", u: "ぎゅ", o: "ぎょ"},
        b: {a: "びゃ", u: "びゅ", o: "びょ"}
      },
      h: {
        w: {a: "うぁ", i: "うぃ", u: "う", e:"うぇ", o: "うぉ"},
        c: {a: "ちゃ", i: "ち", u: "ちゅ", e: "ちぇ", o: "ちょ"},
        s: {a: "しゃ", i: "し", u: "しゅ", e:"しぇ", o: "しょ"}
      },
      s: {
        t: {a: "つぁ", i: "つぃ", u: "つ", e: "つぇ", o: "つぉ"}
      }
    }
  }
);
