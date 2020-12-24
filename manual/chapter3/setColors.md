# Set Colors
You can set font color and background color to use `editor.config.colors`:

```js
const E = window.wangEditor
const editor = new E('#div1')

// set color and background color
editor.config.colors = [
    '#000000',
    '#eeece0',
    '#1c487f',
    '#4d80bf'
]

editor.create()
```