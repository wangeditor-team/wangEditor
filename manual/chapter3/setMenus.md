# Set Menus
You should set menus before creating editor.

## editor.config.menus
The option define which menus are visible and menus order.For example:

```html
<div id="div1">
    <p>welcome to use wangEditor editor</p>
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')

    // set menus, change order
    editor.config.menus = [
        'bold',
        'head',
        'link',
        'italic',
        'underline'
    ]

    editor.create()
</script>
```

## editor.config.excludeMenus
The option define which menus are excluded.For example:

```html
<div id="div1">
    <p>welcome to use wangEditor editor</p>
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')

    // set exclude menus
    editor.config.excludeMenus = [
        'emoticon',
        'video'
    ]

    editor.create()
</script>
```
**Note in order to avoid conflict, don't both set `menus` and `excludeMenus`.**

## All Menus
By default, editor show all menus, all menus as follows:

```js
editor.config.menus = [
    'head',
    'bold',
    'fontSize',
    'fontName',
    'italic',
    'underline',
    'strikeThrough',
    'indent',
    'lineHeight',
    'foreColor',
    'backColor',
    'link',
    'list',
    'justify',
    'quote',
    'emoticon',
    'image',
    'video',
    'table',
    'code',
    'splitLine',
    'undo',
    'redo',
]
```
