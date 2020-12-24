# Set Font Size
You can set font size to use `editor.config.fontSizes`:

```js
const E = window.wangEditor
const editor = new E('#div1')

editor.config.fontSizes = {
    'x-small': { name: '10px', value: '1' },
    'small': { name: '13px', value: '2' },
    'normal': { name: '16px', value: '3' },
    'large': { name: '18px', value: '4' },
    'x-large': { name: '24px', value: '5' },
    'xx-large': { name: '32px', value: '6' },
    'xxx-large': { name: '48px', value: '7' },
}

editor.create()
```
Note especially in above example:
- `key` value that `x-small`, `small`, `normal` can't change, the `key` value only can decrease.
- `value` is '1 - 7' can't change too, it only can decrease. And the `key` must be correspond with `value`.Such as, `small` is correspond with `2`.

**So in above example, you can change `name`. It will not work immediately after the modification, and some adjustments need to be made.**

Taking `'large': { name: '18px', value: '4' }` as an example, when you set the font size value, it should generate `<font size="4">...</font>`. So you need to add extra styles, it make `size="4"` to be correspond with `font-size: 18px; `.

```css
font[size="4"] {
    font-size: 18px;
}
```
The page for editor need above css, the page show editor content too.
