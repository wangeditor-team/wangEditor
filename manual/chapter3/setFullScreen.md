# Set Full Screen
## Set Option
You can use `editor.config.showFullScreen` to set full screen before creating editor, the default value is `true`.

Note it is not supported when toolbar and editable area are separated. ([toolbar and editable area are separated](http://www.wangeditor.com/doc/pages/01-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8/03-%E8%8F%9C%E5%8D%95%E5%92%8C%E7%BC%96%E8%BE%91%E5%8C%BA%E5%9F%9F%E5%88%86%E7%A6%BB.html))

```html
<div id="div1">
    <p>welcome to use wangEditor editor</p>
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')

    // cancel full screen
    editor.config.showFullScreen = false

    editor.create()
</script>
```

## API
And we provide API for users(When toolbar and editable area are separated, APIs doesn't work too).

```js
editor.fullScreen() // set full screen
editor.unFullScreen() // cancel full screen
```