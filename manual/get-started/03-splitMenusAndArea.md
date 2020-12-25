# split menus and editing area
if you want split menu and editing area, that can come true.

menus and editing area is controlled element, that can custom styles. for example: fixed menu、auto add editing area height and so on.

```
<head>
    <style>
        .toolbar {
            border: 1px solid #ccc;
        }
        .text {
            border: 1px solid #ccc;
            min-height: 400px;
        }
    </style>
</head>
<body>
    <p>
        container and toolbar split
    </p>
    <div>
        <div id="toolbar-container" class="toolbar"></div>
        <p>------ split line ------</p>
        <div id="text-container" class="text"></div>
    </div>

    <script src="//unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
    <script>
        const E = window.wangEditor
        const editor = new E('#toolbar-container', '#text-container') // transfer two element
        editor.create()
    </script>
</body>
```

see upper code , menu and editing area is two `div`, position and size can set as whatever you want.