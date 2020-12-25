# multiple editor on one web page

wangEditor support create multiple editor on one web page

```
<head>
    <style type="text/css">
        .toolbar {
            background-color: #f1f1f1;
            border: 1px solid #ccc;
        }
        .text {
            border: 1px solid #ccc;
            height: 200px;
        }
    </style>
</head>
<body>
    <div id="div1" class="toolbar">
    </div>
    <div style="padding: 5px 0; color: #ccc">split section</div>
    <div id="div2" class="text">
        <p>first demo（menus and editing area split）</p>
    </div>

    <div id="div3">
        <p>second demo（noraml）</p>
    </div>

    <!-- inclue js -->
    <script type="text/javascript" src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
    <script type="text/javascript">
        const E = window.wangEditor

        const editor1 = new E('#div1', '#div2')
        editor1.create()

        const editor2 = new E('#div3')
        editor2.create()
    </script>
</body>
```