var vows = require("vows"),
    assert = require("assert"),
    migemoge = require("../migemoge");

vows.describe("ローマ字から平仮名に変換").addBatch({
  "migemoっぽい正規表現をkyaakkinkuから生成したしたとき": {
    topic: migemoge.exec("kyaakkinku"),
    "きゃあっきんくはマッチする": function (res) {
      var _regexp = new RegExp(res, "i")
      assert.notEqual("きゃあっきんく".match(_regexp), null);
    },
    "kyakkinkuはマッチする": function (res) {
      var _regexp = new RegExp(res, "i")
      assert.notEqual("kyaakkinku".match(_regexp), null);
    },
    "きゃっきんくはマッチしない": function (res) {
      var _regexp = new RegExp(res, "i")
      assert.equal("きゃっきんく".match(_regexp), null);
    },
  }
}).export(module);
