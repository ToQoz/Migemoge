vows = require "vows"
assert = require "assert"
migemoge = require "../migemoge"

vows.describe("ローマ字から平仮名に変換").addBatch(
  "migemoっぽい正規表現をkyaakkinkuから生成したしたとき":
    topic: migemoge.exec "kyaakkinku"
    "きゃあっきんくはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "きゃあっきんく".match(_regexp), null

    "kyakkinkuはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "kyaakkinku".match(_regexp), null

    "きゃっきんくはマッチしない": (res)->
      _regexp = new RegExp res, "i"
      assert.equal "きゃっきんく".match(_regexp), null

  "migemoっぽい正規表現をcokkumogから生成したしたとき":
    topic: migemoge.exec "cokkumog"
    "こっくもぐはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "こっくもぐ".match(_regexp), null
    "コックモグはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "コックモグ".match(_regexp), null
    "cokkumogはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "cokkumog".match(_regexp), null
    "こっくもくはマッチしない": (res)->
      _regexp = new RegExp res, "i"
      assert.equal "こっくもく".match(_regexp), null

  "migemoっぽい正規表現をnnkoから生成したしたとき":
    topic: migemoge.exec "nnko"
    "んこはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "んこ".match(_regexp), null
    "nnkoはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "nnko".match(_regexp), null
    "うこはマッチしない": (res)->
      _regexp = new RegExp res, "i"
      assert.equal "うこ".match(_regexp), null

  "migemoっぽい正規表現をnnnkoから生成したしたとき":
    topic: migemoge.exec "nnnko"
    "んんこはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "んんこ".match(_regexp), null
    "nnnkoはマッチする": (res)->
      _regexp = new RegExp res, "i"
      assert.notEqual "nnnko".match(_regexp), null
    "んこはマッチしない": (res)->
      _regexp = new RegExp res, "i"
      assert.equal "うんこ".match(_regexp), null
).export module
