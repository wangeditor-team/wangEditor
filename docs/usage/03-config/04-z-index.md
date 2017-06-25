# 配置编辑区域的 z-index

编辑区域的`z-index`默认为`10000`，可自定义修改，代码配置如下。需改之后，编辑区域和菜单的`z-index`会同时生效。

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.customConfig.zIndex = 100
    editor.create()
</script>
```


