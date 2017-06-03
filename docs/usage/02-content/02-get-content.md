# 读取内容

可以`html`和`text`的方式读取编辑器的内容

```html
<div id="div1">
    <p>欢迎使用 wangEditor 编辑器</p>
</div>
<button id="btn1">获取html</button>
<button id="btn2">获取text</button>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.create()

    document.getElementById('btn1').addEventListener('click', function () {
        // 读取 html
        alert(editor.txt.html())
    }, false)

    document.getElementById('btn2').addEventListener('click', function () {
        // 读取 text
        alert(editor.txt.text())
    }, false)

</script>
```

