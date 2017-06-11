# 菜单和编辑区域分离

如果你想要像 知乎专栏、简书、石墨、网易云笔记 这些编辑页面一样，将编辑区域和菜单分离，也可以实现。

这样，菜单和编辑器区域就是使用者可自己控制的元素，可自定义样式。例如：将菜单`fixed`、编辑器区域高度自动增加等

## 代码示例

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>wangEditor 菜单和编辑器区域分离</title>
    <style type="text/css">
        .toolbar {
            border: 1px solid #ccc;
        }
        .text {
            border: 1px solid #ccc;
            height: 400px;
        }
    </style>
</head>
<body>
    <div id="div1" class="toolbar">
    </div>
    <div style="padding: 5px 0; color: #ccc">中间隔离带</div>
    <div id="div2" class="text"> <!--可使用 min-height 实现编辑区域自动增加高度-->
        <p>请输入内容</p>
    </div>

    <script type="text/javascript" src="/wangEditor.min.js"></script>
    <script type="text/javascript">
        var E = window.wangEditor
        var editor1 = new E('#div1', '#div2')  // 两个参数也可以传入 elem 对象，class 选择器
        editor1.create()
    </script>
</body>
</html>
```

## 显示效果

从上面代码可以看出，菜单和编辑区域其实就是两个单独的`<div>`，位置、尺寸都可以随便定义。

![](http://images2015.cnblogs.com/blog/138012/201705/138012-20170531224756289-7442240.png)

