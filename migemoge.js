// これ配列でかえさずに, ローマ字をそのまま順番にtableで絞りこんでいくと言い気がしてきた
(function(define) {
  define([], function() {
    var migemoge ={
      name: "migemoge",
      initialize: initialize,
      // 確定していないアルファベット
      toRegExp: toRegExp,
      unsettled: "",
      clearUnsettled: clearUnsettled,
      // 母音のアルファベットの配列
      boin: "aiueo".split(""),
      // 母音の平仮名の配列
      hiraBoin: "あいうえお".split(""),
      // 母音のアルファベットをキーとした平仮名のオブジェクト
      boinTable: {},
      separateWrapper: separateWrapper,
      // アルファベットを日本語の音で分ける
      separate: separate,
      // for など抜ける用
      // 実行
      exec: exec,
      // 音で区切ったアルファベットを平仮名に変換
      roma2Hira: roma2Hira,
      shiinTable: {
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
      specialTable: {
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
    function initialize() {
      var i, l;
      for (i = 0, l = this.boin.length; i < l; i++) {
        this.boinTable[this.boin[i]] = this.hiraBoin[i];
      }
      return this;
    }

    function clearUnsettled() {
      this.unsettled = "";
    }

    function separateWrapper(str) {
      var res = [],
          i, l;
      for (i = 0, l = str.length; i < l; i++) {
        separatedStr = this.separate(str[i], ((l-i) === 1));
        if (separatedStr) {
          res[res.length] = separatedStr;
        }
      }
      return res;
    }
    function roma2Hira(romaAry) {
      var res = [], i, l, v;
      // 未確定の値が残っていた場合は評価に加える
      if (this.unsettled) romaAry[romaAry.length] = this.unsettled;

      console.log(romaAry);
      for (i=0, l=romaAry.length; i<l; i++) {
        // "kki" などの扱いは "kk" + "ki" で「っき」としているので,
        // kakki => ["ka", "kk", "ki"] => /(か|ka)(っ|kk)(き|k)/となり, 元のkakkiでマッチしなくなるので,
        // それを避けるための処理
        if (romaAry[i].length === 2 && romaAry[i][0] === romaAry[i][1]) {
          romaAry[i] = romaAry[i] + "|" + romaAry[i][0];
        }

        romaStr = romaAry[i];
        // 母音の場合
        if (this.boin.indexOf(romaStr[0]) !== -1) {
          // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
          res[res.length] = toRegExp(this.boinTable[romaStr[0]], romaStr);
        // 子音
        } else {
          // 2文字以上でspecialTable
          if (romaStr.length>=2 && romaStr[1] in this.specialTable && romaStr[0] in this.specialTable[romaStr[1]]) {
            if (romaStr.length>=3 && romaStr[2] in this.specialTable[romaStr[1]][romaStr[0]]) {
               res[res.length] = this.toRegExp(this.specialTable[romaStr[1]][romaStr[0]][romaStr[2]], romaStr);
            // 未確定 
            } else {
              hiraAry = [];
              for (key in this.specialTable[romaStr[1]][romaStr[0]]) {
                hiraAry[arry.length] = this.specialTable[romaStr[1]][romaStr[0]][key];
              }
              // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
              res[res.length] = this.toRegExp(hiraAry, romaStr);
            }
          } else {
            // 1文字かつラストの文字の時
            if (romaStr.length === 1 && ((l-i) === 1)) {
                // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
              res[res.length] = this.toRegExp(this.shiinTable[romaStr[0]].split(""), romaStr);
            } else {
              res[res.length] = 
                // 元のローマ字と, 変換後の平仮名を結合, こんな感じroma|hira
                // 子音 + 母音
                (this.boin.indexOf(romaStr[1]) !== -1) ? this.toRegExp(this.shiinTable[romaStr[0]][this.boin.indexOf(romaStr[1])], romaStr):
                // 子音 * 2
                (romaStr[0] === romaStr[1]) ? this.toRegExp(this.shiinTable[romaStr[0]][this.boin.length], romaStr):
                romaAry[i];
            }
          }
        }
      }
      ;  
      return "(" + res.join(")(") + ")";
    }

    // オブジェクトのタイプを確かめる
    function is(type, obj) {
      if (type === "Number") return (obj === +obj); // こっちのほうが高速なので
      if (type === "undefined") return (typeof obj === "undefined");

      // [Object String] の'[Object ' と ']' を取り除くためにsliceしている
      var clas = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== null && clas === type;
    };

    function toRegExp(hiraAry, roma) {
      var hiraStr = "";
      if (is("Array", hiraAry)) hiraStr = hiraAry.join("|");
      return (hiraStr) ? roma + "|" + hiraStr : roma + "|" + hiraAry;
    }
    function separate(chara, isLast) {
      var res = false,
          // 判定用なので値を変えない
          _unsettled = this.unsettled;
      // 母音が渡ってきたとき
      if (this.boin.indexOf(chara) !== -1) {
        this.clearUnsettled();
        return (_unsettled) ? _unsettled + chara : chara;
      // 子音が渡ってきたとき
      } else {
        // 未確定の子音が3文字以上あるとき -> 一旦終了
        // 既に未確定の子音がないとき
        if (!_unsettled) {
          this.unsettled = chara;
          return "";
        // 未確定の子音があるとき
        } else {
          // specialTableに存在するキー{xとおく}, y, hが渡ってきたときに
          // _unsettled が specialTable[x]のキーとして存在する場合 -> specialTableが使える
          if (chara in this.specialTable && _unsettled in this.specialTable[chara]) {
            if (isLast) return _unsettled + chara;
            if (chara === _unsettled) {
              this.unsettled = (_unsettled === "n") ? "" : chara;
              return _unsettled + chara;
            }
            this.unsettled = _unsettled + chara;
            return "";
          // specialTableが使えない
          } else {
            // 未確定の子音が渡ってきた子音と同じとき
            if (chara === _unsettled) {
              // _unsettled{n}, chara{n}であれば, this.unsettledクリアして,            _unsettled + charaを返す.
              // それ以外, _unsettled{k}, chara{n}, this.unsettledにchara{k} を入れて, _unsettled + charaを返す.
              this.unsettled = (_unsettled === "n") ? "" : chara;
              return _unsettled + chara;
            // 未確定の子音が渡ってきた子音と違うとき
            } else {
              this.unsettled = chara;
              // nが確定していない値としてセットされている場合(nk, nn)とそれ以外の場合(不正な場合)(e.g. kn, kv)
              return (_unsettled === "n") ? (_unsettled + _unsettled) : "";
            }
          }
        }
      }
    }
    function exec(str) {
      this.clearUnsettled();
      return this.roma2Hira(this.separateWrapper(str));
    }
    return migemoge.initialize();
  });
})(
  // use define for AMD if available
  typeof define !== 'undefined' ? define :
  // If no define, look for module to export as a CommonJS module.
  (typeof module !== 'undefined') ? function(deps, factory) {
    module.exports = factory();
  } :
  // If no define or module, attach to current context.
  function(namespace, factory) {
    var module = factory();
    this[module.name] = module;
  }
);
