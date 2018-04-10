# 自定义菜单

编辑器创建之前，可使用`editor.customConfig.menus`定义显示哪些菜单和菜单的顺序。**注意：v3 版本的菜单不支持换行折叠了（因为换行之后菜单栏是在太难看），如果菜单栏宽度不够，建议精简菜单项。**

## 代码示例

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    // 自定义菜单配置
    editor.customConfig.menus = [
        'head',
        'bold',
        'italic',
        'underline'
    ]
    editor.create()
</script>
```

## 默认菜单

编辑默认的菜单配置如下

```javascript
[
    'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'emoticon',  // 表情
    'image',  // 插入图片
    'table',  // 表格
    'video',  // 插入视频
    'code',  // 插入代码
    'undo',  // 撤销
    'redo'  // 重复
]
```
