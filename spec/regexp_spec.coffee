vows = require "vows"
assert = require "assert"

vows.describe("組み込み正規表現").addBatch(
  "正規表現がマッチしたとき":
    topic: "javascript".match RegExp(".*script", "i")
    "null以外を返す": (res)->
      assert.notEqual res, null;
  "正規表現がマッチしなかったとき":
    topic: "php".match RegExp(".*script", "i")
    "phpはnullを返す": (res)->
      assert.equal res, null
).export module
