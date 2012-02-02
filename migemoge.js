// これ配列でかえさずに, ローマ字をそのまま順番にtableで絞りこんでいくと言い気がしてきた
(function(define) {
  define([], function() {
    /*
    * prefix: 
    * al アルファベット
    * bo 母音
    * si 子音
    * sp y, hなど子音と母音の間に入る音
    * hi 平仮名
    * ka カタカナ
    */

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

    var table = {
      // 母音のアルファベットの配列
      al_boin: "aiueo".split(""),
      // 母音の平仮名の配列
      hi_boin: "あいうえお".split(""),
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
    };

    var _migemoge = {
      // 正規化
      toRegExp_: toRegExp_,
      // 確定していないアルファベット
      pending_: "",
      // 確定していないアルファベットをクリアする
      clearPending_: clearPending_,
      separateWrapper_: separateWrapper_,
      // アルファベットを日本語の音で分ける
      separate_: separate_,
      // 音で区切ったアルファベットの配列をを平仮名の文字列に変換
      roma2hira_: roma2hira_,
      // 平仮名をカタカナに変換
      hira2kata_: hira2kata_
    };

    // インターフェース
    var migemoge = {
      // モジュール名
      name: "migemoge",
      // 実行
      exec: function(str) {
        return (function() {
          this.clearPending_();
          return this.roma2hira_(this.separateWrapper_(str));
        }).call(_migemoge, str);
      }
    };

    return (function() {
      var i, l;
      for (i = 0, l = table.al_boin.length; i < l; i++) {
        table.boin[table.al_boin[i]] = table.hi_boin[i];
      }
      return this;
    }).call(migemoge);


    // 実装

    function clearPending_() {
      this.pending_ = "";
    }

    function separateWrapper_(str) {
      var separatedAry = [],
          i, l;
      for (i = 0, l = str.length; i < l; i++) {
        separated = this.separate_(str[i], ((l-i) === 1));
        if (separated) {
          separatedAry[separatedAry.length] = separated;
        }
      }
      return separatedAry;
    }

    function hira2kata_(hira) {
      var i, c, a = [];
      for(i=hira.length-1;0<=i;i--) {
          c = hira.charCodeAt(i);
          a[i] = (0x3041 <= c && c <= 0x3096) ? c + 0x0060 : c;
      };
      return String.fromCharCode.apply(null, a);
    }

    function roma2hira_(romaAry) {
      var res = [], i, l, v;
      // 未確定の値が残っていた場合は評価に加える
      if (this.pending_) romaAry[romaAry.length] = this.pending_;

      for (i=0, l=romaAry.length; i<l; i++) {
        // "kki" などの扱いは "kk" + "ki" で「っき」としているので,
        // kakki => ["ka", "kk", "ki"] => /(か|ka)(っ|kk)(き|k)/となり, 元のkakkiでマッチしなくなるので,
        // それを避けるための処理
        if (romaAry[i].length === 2 && romaAry[i][0] === romaAry[i][1]) {
          romaAry[i] = romaAry[i] + "|" + romaAry[i][0];
        }

        roma = romaAry[i];
        // 母音の場合
        if (table.al_boin.indexOf(roma[0]) !== -1) {
          // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
          res[res.length] = this.toRegExp_(table.boin[roma[0]], roma);
        // 子音
        } else {
          // 2文字以上でspecialTable
          if (roma.length>=2 && roma[1] in table.special && roma[0] in table.special[roma[1]]) {
            if (roma.length>=3 && roma[2] in table.special[roma[1]][roma[0]]) {
               res[res.length] = this.toRegExp_(table.special[roma[1]][roma[0]][roma[2]], roma);
            // 未確定 
            } else {
              hiraAry = [];
              for (key in table.special[roma[1]][roma[0]]) {
                hiraAry[arry.length] = table.special[roma[1]][roma[0]][key];
              }
              // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
              res[res.length] = this.toRegExp_(hiraAry, roma);
            }
          } else {
            // 1文字かつラストの文字の時
            if (roma.length === 1 && ((l-i) === 1)) {
                // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
              res[res.length] = this.toRegExp_(table.shiin[roma[0]].split(""), roma);
            } else {
              res[res.length] = 
                // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
                // 子音 + 母音
                (table.al_boin.indexOf(roma[1]) !== -1) ? this.toRegExp_(table.shiin[roma[0]][table.al_boin.indexOf(roma[1])], roma):
                // 子音 * 2
                (roma[0] === roma[1]) ? this.toRegExp_(table.shiin[roma[0]][table.al_boin.length], roma):
                                        roma;
            }
          }
        }
      }
      return "(" + res.join(")(") + ")";
    }

    function toRegExp_(_hira, roma) {
      var hiraStr = "";
      hira = (is("Array", _hira)) ? _hira.join("|") : _hira;
      return roma + "|" + hira + "|" + this.hira2kata_(hira);
    }

    function separate_(chara, isLast) {
      var res = false,
          // 判定用なので値を変えない
          _pending = this.pending_;
      // 母音が渡ってきたとき
      if (table.al_boin.indexOf(chara) !== -1) {
        this.clearPending_();
        return (_pending) ? _pending + chara : chara;
      // 子音が渡ってきたとき
      } else {
        // 未確定の子音が3文字以上あるとき -> 一旦終了
        // 既に未確定の子音がないとき
        if (!_pending) {
          this.pending_ = chara;
          return "";
        // 未確定の子音があるとき
        } else {
          // specialTableに存在するキー{xとおく}, y, hが渡ってきたときに
          // _pending_ が specialTable[x]のキーとして存在する場合 -> specialTableが使える
          if (chara in table.special && _pending in table.special[chara]) {
            if (isLast) return _pending + chara;
            if (chara === _pending) {
              this.pending_ = (_pending === "n") ? "" : chara;
              return _pending + chara;
            }
            this.pending_ = _pending + chara;
            return "";
          // specialTableが使えない
          } else {
            // 未確定の子音が渡ってきた子音と同じとき
            if (chara === _pending) {
              // _pending{n}, chara{n}であれば, this.pending_クリアして,            _pending + charaを返す.
              // それ以外, _pending{k}, chara{n}, this.pending_にchara{k} を入れて, _pending + charaを返す.
              this.pending_ = (_pending === "n") ? "" : chara;
              return _pending + chara;
            // 未確定の子音が渡ってきた子音と違うとき
            } else {
              this.pending_ = chara;
              // nが確定していない値としてセットされている場合(nk, nn)とそれ以外の場合(不正な場合)(e.g. kn, kv)
              return (_pending === "n") ? (_pending + _pending) : "";
            }
          }
        }
      }
    }
  });
})(
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
  }
);
