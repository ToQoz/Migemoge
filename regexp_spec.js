var vows = require("vows"),
    assert = require("assert");

vows.describe("RegExpのインスタンスを生成したとき").addBatch({
  "そのインスタンスのmatchメソッドは": {
    topic: regExp("javascript", "i"),
    "マッチするときはnull以外を返す": function (res) {
      assert.notEqual("javascript".match(res), null);
    },
    "マッチしないときはnullを返す": function (res) {
      assert.equal("javascript".match(res), null);
    }
  }
}).export(module);
