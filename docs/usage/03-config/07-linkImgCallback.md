# 插入网络图片的回调

插入网络图片时，可通过如下配置获取到图片的信息。`v3.0.10`开始支持。

```js
var E = window.wangEditor
var editor = new E('#div1')
editor.customConfig.linkImgCallback = function (url) {
    console.log(url) // url 即插入图片的地址
}
editor.create()
```
