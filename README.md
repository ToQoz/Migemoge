## ローマ字からそれっぽい平仮名の正規表現を作ります(カタカナ未対応)

## Require
vows (for test)
assert (for test)

## 導入
```
git clone
npm install
# for Test
npm install coffee-script
```

## 使い方

### RequireJSなどのようなdefine関数がある場合,

```javascript
require(['migemoge'], function(migemoge){
    // いけるはず, ※まだ試せていない.
    migemoge.exec("hoge");
});
```

### CommonJS, NodeJSのようにmodule.exportをサポートしている場合.

```javascript
    var migemoge = require("./migemoge");
    migemoge.exec("hoge");
```

### 上記の両方が使えない(Webクライントサイド)

```javascript
// HTMLのscriptタグで読み込み後
// ※この場合window.migemogeのみグローバル汚染します.
migemoge.exec("hoge");
```

## Copyright

Copyright (C) 2012 Takatoshi Matsumoto

Released under the :WTFPL => sam.zoy.org/wtfpl
