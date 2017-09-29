# 插入链接的校验

插入链接时，可通过如下配置对文字和链接进行校验。`v3.0.10`开始支持。

```js
var E = window.wangEditor
var editor = new E('#div1')
editor.customConfig.linkCheck = function (text, link) {
    console.log(text) // 插入的文字
    console.log(link) // 插入的链接

    return true // 返回 true 表示校验成功
    // return '验证失败' // 返回字符串，即校验失败的提示信息
}
editor.create()
```