# 预防 XSS 攻击

> 术业有专攻

要想在前端预防 xss 攻击，还得依赖于其他工具，例如[xss.js](http://jsxss.com/zh/index.html)（如果打不开页面，就从百度搜一下）

代码示例如下

```html
<script src='/xss.js'></script>
<script src='/wangEditor.min.js'></script>
<script>
    var E = window.wangEditor
    var editor = new E('#div1')

    document.getElementById('btn1').addEventListener('click', function () {
        var html = editor.txt.html()
        var filterHtml = filterXSS(html)  // 此处进行 xss 攻击过滤
        alert(filterHtml)
    }, false)
</script>
```

