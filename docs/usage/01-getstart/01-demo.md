# 简单的 demo

## 下载

- 点击 [https://github.com/wangfupeng1988/wangEditor/releases](https://github.com/wangfupeng1988/wangEditor/releases) 下载最新版。进入`release`文件夹下找到`wangEditor.js`或者`wangEditor.min.js`即可
- 使用CDN：[//unpkg.com/wangeditor/release/wangEditor.min.js](https://unpkg.com/wangeditor/release/wangEditor.min.js)
- 使用`bower`下载：`bower install wangEditor` （前提保证电脑已安装了`bower`）

*PS：支持`npm`安装，请参见后面的章节*

## 制作 demo

编辑器效果如下。

![图片](https://camo.githubusercontent.com/f3d072718d8fcbbacf8cc80465a34cceffcf5b4a/687474703a2f2f696d61676573323031352e636e626c6f67732e636f6d2f626c6f672f3133383031322f3230313730352f3133383031322d32303137303533303230323930353633332d313834303135383938312e706e67)

代码示例如下。**注意，以下代码中无需引用任何 CSS 文件！！！**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>wangEditor demo</title>
</head>
<body>
    <div id="editor">
        <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
    </div>

    <!-- 注意， 只需要引用 JS，无需引用任何 CSS ！！！-->
    <script type="text/javascript" src="/wangEditor.min.js"></script>
    <script type="text/javascript">
        var E = window.wangEditor
        var editor = new E('#editor')
        // 或者 var editor = new E( document.getElementById('#editor') )
        editor.create()
    </script>
</body>
</html>
```
