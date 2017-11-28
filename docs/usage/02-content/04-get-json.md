# 获取 JSON 格式的内容

可以通过`editor.txt.getJSON`获取 JSON 格式的编辑器的内容，`v3.0.14`开始支持，示例如下

```html
<div id="div1">
    <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
    <img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png" style="max-width:100%;"/>
</div>
<button id="btn1">getJSON</button>

<script type="text/javascript" src="/wangEditor.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    editor.create()

    document.getElementById('btn1').addEventListener('click', function () {
        var json = editor.txt.getJSON()  // 获取 JSON 格式的内容
        var jsonStr = JSON.stringify(json)
        console.log(json)
        console.log(jsonStr)
    })
</script>
```


-----

如果编辑器区域的 html 内容是如下：

```html
<p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
<img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png" style="max-width:100%;"/>
```

那么获取的 JSON 格式就如下：

```json
[
    {
        "tag": "p",
        "attrs": [],
        "children": [
            "欢迎使用 ",
            {
                "tag": "b",
                "attrs": [],
                "children": [
                    "wangEditor"
                ]
            },
            " 富文本编辑器"
        ]
    },
    {
        "tag": "img",
        "attrs": [
            {
                "name": "src",
                "value": "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png"
            },
            {
                "name": "style",
                "value": "max-width:100%;"
            }
        ],
        "children": []
    },
    {
        "tag": "p",
        "attrs": [],
        "children": [
            {
                "tag": "br",
                "attrs": [],
                "children": []
            }
        ]
    }
]
```