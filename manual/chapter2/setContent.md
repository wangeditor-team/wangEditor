# Set Content
If conditions allow, you best to use first way in follow several ways.

## Use HTML
You can set innerHTML content which you want to init in `div` for creating editor.

```html
<div id="div1">
    <p>inital content</p>
    <p>inital content</p>
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')
    editor.create()
</script>
```

## Use JS
And you can use `editor.txt.html(...)` to set editor content after creating editor.

```js
<div id="div1">
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')
    editor.create()
    editor.txt.html('<p>set conetnt by JS API</p>') // set content
</script>
```
