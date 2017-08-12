# 关闭粘贴样式的过滤

当从其他网页复制文本内容粘贴到编辑器中，编辑器会默认过滤掉复制文本中自带的样式，目的是让粘贴后的文本变得更加简洁和轻量。用户可通过以下方式手动关闭掉粘贴样式的过滤。

**注意，该配置暂时对 IE 无效。IE 暂时使用系统自带的粘贴功能，没有样式过滤！**

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    // 关闭粘贴样式的过滤
    editor.customConfig.pasteFilterStyle = false
    editor.create()
</script>
```

