# Set Font Size
You can set font family to use `editor.config.fontNames`:

```js
const E = window.wangEditor
const editor = new E('#div1')

editor.config.fontNames = [
    'Arial'
    'Tahoma',
    'Verdana',
    'Times New Roman',
    'Courier New',
]

editor.create()
```

