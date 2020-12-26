# Use textarea

wangEditor no support `textarea` ,but you can use `onchange` come true submit rich text content from `textarea`

```jsx
<div id="div1">
    <p>webcomle use <b>wangEditor</b> rich text editor</p>
</div>
<textarea id="text1" style="width:100%; height:200px;"></textarea>

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')
    const $text1 = $('#text1')
    editor.config.onchange = function (html) {
				// step two，observe change, sync update to textarea
        $text1.val(html)
    }
    editor.create()
		// frist，init textarea value
    $text1.val(editor.txt.html())
</script>
```