# 配置 onfocus 函数

配置`onfocus`函数之后，用户点击富文本区域会触发`onfocus`函数执行。

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.customConfig.onfocus = function () {
        console.log("onfocus")
    }
    editor.create()
</script>
```
