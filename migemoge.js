// これ配列でかえさずに, ローマ字をそのまま順番にtableで絞りこんでいくと言い気がしてきた
(function(define) {
  define([], function() {
    var migemoge ={
      name: "migemoge",
      initialize: initialize,
      // 確定していないアルファベット
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
      breaker: {},
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
          if (separatedStr === this.breaker) return res;
          res[res.length] = separatedStr;
        }
      }
      return res;
    }
    function roma2Hira(romaAry) {
      var res = [], i, l, v;
      // 未確定の値が残っていた場合は評価に加える
      if (this.unsettled) romaAry[romaAry.length] = this.unsettled;
      for (i=0, l=romaAry.length; i<l; i++) {
        str = romaAry[i];
        // "kki" などの扱いは "kk" + "ki" で「っき」としているので,
        // kakki => ["ka", "kk", "ki"] => /(か|ka)(っ|kk)(き|k)/となり, 元のkakkiでマッチしなくなるので,
        // それを避けるための処理
        if (romaAry[i].length === 2 && romaAry[i][0] === romaAry[i][1]) romaAry[i] = romaAry[i] + "|" + romaAry[i][0];
        // 母音の場合
        if (this.boin.indexOf(str[0]) !== -1) {
          res[res.length] = this.boinTable[str[0]] + "|" + romaAry[i];
        // 子音
        } else {
          // 2文字以上でspecialTable
          if (str.length>=2 && str[1] in this.specialTable && str[0] in this.specialTable[str[1]]) {
            if (str.length>=3 && str[2] in this.specialTable[str[1]][str[0]]) {
               res[res.length] = this.specialTable[str[1]][str[0]][str[2]] + "|" + romaAry[i];
            // 未確定 
            } else {
              hiraAry = [];
              for (key in this.specialTable[str[1]][str[0]]) {
                hiraAry[arry.length] = this.specialTable[str[1]][str[0]][key];
              }
              // romaAryと結合したあとに こんな感じroma|hira
              res[res.length] = hiraAry.join("|") + "|" + romaAry[i];
            }
          } else {
            // ラストの文字の時
            if (str.length === 1 && ((l-i) === 1)) {
              // 未確定
              res[res.length] = this.shiinTable[str[0]].split("").join("|") +  "|" + romaAry[i];
            } else {
              res[res.length] = (this.boin.indexOf(str[1]) !== -1) ? this.shiinTable[str[0]][this.boin.indexOf(str[1])] + "|" + romaAry[i]: // 子音 + 母音
                                (str[0] === str[1]) ? this.shiinTable[str[0]][this.boin.length] + "|" + romaAry[i]: // 子音 * 2
                                romaAry[i];
            }
          }
        }
      }
      ;  
      return "(" + res.join(")(") + ")";
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
          return false;
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
            return false;
          // specialTableが使えない
          } else {
            // 未確定の子音が渡ってきた子音と同じとき
            if (chara === _unsettled) {
              // _unsettled{n}, chara{n}であれば, this.unsettledクリアして,            _unsettled + charaを返す.
              // それ以外, _unsettled{k}, chara{n}, this.unsettledにchara{k} を入れて, _unsettled + charaを返す.
              // TODO unsettledが最後に残ってるときに評価する
              this.unsettled = (_unsettled === "n") ? "" : chara;
              return _unsettled + chara;
            // 未確定の子音が渡ってきた子音と違うとき
            } else {
              // _unsettled{n}chara{k} とか, _unsettled*2{nn}を返して, 次の_unsettledにchara{k}をいれる.
              this.unsettled = chara;
              // nが確定していない値としてセットされている場合(nk, nn)とそれ以外の場合(不正な場合)(e.g. kn, kv)
              return (_unsettled === "n") ? (_unsettled + _unsettled) : false;
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
