# 定义 debug 模式

可通过`editor.customConfig.debug = true`配置`debug`模式，`debug`模式下，有 JS 错误会以`throw Error`方式提示出来。默认值为`false`，即不会抛出异常。

但是，在实际开发中不建议直接定义为`true`或者`false`，可通过 url 参数进行干预，示例如下：

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')
    // 通过 url 参数配置 debug 模式。url 中带有 wangeditor_debug_mode=1 才会开启 debug 模式
    editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0
    editor.create()
</script>
```

