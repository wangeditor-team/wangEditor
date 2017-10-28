# 配置 onchange 函数

配置`onchange`函数之后，用户操作（鼠标点击、键盘打字等）导致的内容变化之后，会自动触发`onchange`函数执行。

但是，**用户自己使用 JS 修改了`div1`的`innerHTML`，不会自动触发`onchange`函数**，此时你可以通过执行`editor.change()`来手动触发`onchange`函数的执行。

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<p>手动触发 onchange 函数执行</p>
<button id="btn1">change</button>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.customConfig.onchange = function (html) {
        // html 即变化之后的内容
        console.log(html)
    }
    editor.create()

    document.getElementById('btn1').addEventListener('click', function () {
        // 如果未配置 editor.customConfig.onchange，则 editor.change 为 undefined
        editor.change && editor.change()
    })

</script>
```

-----

另外，如果需要修改 onchange 触发的延迟时间（onchange 会在用户无任何操作的 xxx 毫秒之后被触发），可通过如下配置

```js
// 自定义 onchange 触发的延迟时间，默认为 200 ms
editor.customConfig.onchangeTimeout = 1000 // 单位 ms
```
