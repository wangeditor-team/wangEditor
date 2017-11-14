# 粘贴文本

**注意，以下配置暂时对 IE 无效。IE 暂时使用系统自带的粘贴功能，没有样式过滤！**

## 关闭粘贴样式的过滤

当从其他网页复制文本内容粘贴到编辑器中，编辑器会默认过滤掉复制文本中自带的样式，目的是让粘贴后的文本变得更加简洁和轻量。用户可通过`editor.customConfig.pasteFilterStyle = false`手动关闭掉粘贴样式的过滤。

## 自定义处理粘贴的文本内容

使用者可通过`editor.customConfig.pasteTextHandle`对粘贴的文本内容进行自定义的过滤、处理等操作，然后返回处理之后的文本内容。编辑器最终会粘贴用户处理之后并且返回的的内容。

## 示例代码

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
    // 自定义处理粘贴的文本内容
    editor.customConfig.pasteTextHandle = function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        return content + '<p>在粘贴内容后面追加一行</p>'
    }
    editor.create()
</script>
```