# 多语言

可以通过`lang`配置项配置多语言，其实就是通过该配置项中的配置，将编辑器显示的文字，替换成你需要的文字。

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')

    editor.customConfig.lang = {
        '设置标题': 'title',
        '正文': 'p',
        '链接文字': 'link text',
        '链接': 'link',
        '上传图片': 'upload image',
        '上传': 'upload',
        '创建': 'init'
        // 还可自定添加更多
    }

    editor.create()
</script>
```

**注意，以上代码中的`链接文字`要写在`链接`前面，`上传图片`要写在`上传`前面，因为前者包含后者。如果不这样做，可能会出现替换不全的问题，切记切记！**
