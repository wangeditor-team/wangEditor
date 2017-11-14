# 插入网络图片的校验

插入网络图片时，可对图片地址做自定义校验。`v3.0.13`开始支持。

```js
var E = window.wangEditor
var editor = new E('#div1')
editor.customConfig.linkImgCheck = function (src) {
    console.log(src) // 图片的链接

    return true // 返回 true 表示校验成功
    // return '验证失败' // 返回字符串，即校验失败的提示信息
}
editor.create()
```