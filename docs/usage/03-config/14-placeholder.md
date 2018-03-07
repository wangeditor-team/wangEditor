# 配置 placeholder

配置`placeholder`后，如需修改样式请覆盖`.w-e-text-placeholder`的样式。

```html
<div id="div1">

</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.customConfig.placeholder = '欢迎使用 wangEditor 富文本编辑器'
    editor.create()
</script>
```
