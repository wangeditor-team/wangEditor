# Download

npm `npm i wangeditor --save`

CDN [`https://unpkg.com/wangeditor/dist/wangEditor.min.js`](https://unpkg.com/wangeditor/dist/wangEditor.min.js)

## CDN

example

```jsx
<div id="div1">
    <p>weblcome use <b>wangEditor</b> richEditor</p>
</div>

<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')
    // or const editor = new E( document.getElementById('div1') )
    editor.create()
</script>
```

## npm

example

```jsx
import E from 'wangeditor'
const editor = new E('#div1')
// or const editor = new E( document.getElementById('div1') )
editor.create()
```