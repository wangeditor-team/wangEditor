# 隐藏/显示 tab

## 显示“上传图片”tab

默认情况下，编辑器不会显示“上传图片”的tab，因为你还没有配置上传图片的信息。

![](http://images2015.cnblogs.com/blog/138012/201706/138012-20170601204308039-691571074.png)

参考一下示例显示“上传图片”tab

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')

    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器

    editor.create()
</script>
```

显示效果

![](http://images2015.cnblogs.com/blog/138012/201706/138012-20170601204504524-830243744.png)

## 隐藏“网络图片”tab

默认情况下，“网络图片”tab是一直存在的。如果不需要，可以参考一下示例来隐藏它。

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')

    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false

    editor.create()
</script>
```
