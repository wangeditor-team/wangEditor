# 设置内容

以下方式中，如果条件允许，尽量使用第一种方式，效率最高。

## html 初始化内容

直接将内容写到要创建编辑器的`<div>`标签中

```html
<div id="div1">
    <p>初始化的内容</p>
    <p>初始化的内容</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.create()
</script>
```

## js 设置内容

创建编辑器之后，使用`editor.txt.html(...)`设置编辑器内容

```html
<div id="div1">
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.create()
    editor.txt.html('<p>用 JS 设置的内容</p>')
</script>
```

## 追加内容

创建编辑器之后，可使用`editor.txt.append('<p>追加的内容</p>')`继续追加内容。

## 清空内容

可使用`editor.txt.clear()`清空编辑器内容
