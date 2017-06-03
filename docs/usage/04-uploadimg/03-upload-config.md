# 上传图片 & 配置

将图片上传到服务器上的配置方式

## 上传图片

参考如下代码

```html
<div id="div1">
    <p>欢迎使用 wangEditor 富文本编辑器</p>
</div>

<script type="text/javascript" src="/wangEditor.min.js"></script>
<script type="text/javascript">
    var E = window.wangEditor
    var editor = new E('#div1')

    // 配置服务器端地址
    editor.customConfig.uploadImgServer = '/upload'

    // 进行下文提到的其他配置
    // ……
    // ……
    // ……

    editor.create()
</script>
```

其中`/upload`是上传图片的服务器端接口，接口返回的**数据格式**如下

```json
{
    // errno 即错误代码，0 表示没有错误。
    //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
    errno: 0,

    // data 是一个数组，返回若干图片的线上地址
    data: [
        '图片1地址',
        '图片2地址',
        '……'
    ]
}
```

## 限制图片大小

默认限制图片大小是 5M

```javascript
// 将图片大小限制为 3M
editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
```

## 自定义上传参数

上传图片时可自定义传递一些参数，例如传递验证的`token`等。这些参数会拼接到 url 的参数中。

```javascript
editor.customConfig.uploadImgParams = {
    token: 'abcdef12345'
}
```

## 自定义 header

上传图片时刻自定义设置 header

```javascript
editor.customConfig.uploadImgHeaders = {
    'Accept': 'text/x-json'
}
```

## withCredentials（跨域传递 cookie）

跨域上传中如果需要传递 cookie 需设置 withCredentials

```javascript
editor.customConfig.withCredentials = true
```

## 自定义 timeout 时间

默认的 timeout 时间是 5 秒钟

```javascript
// 将 timeout 时间改为 3s
editor.customConfig.uploadImgTimeout = 3000
```

## 监听函数

可使用监听函数在上传图片的不同阶段做相应处理

```javascript
editor.customConfig.uploadImgHooks = {
    before: function (xhr, editor, files) {
        // 请求发送之前
    },
    success: function (xhr, editor, result) {
        // 上传成功之后
        // result 是服务器端返回的结果
    },
    fail: function (xhr, editor, result) {
        // 上传失败之后
        // result 是服务器端返回的结果
    },
    error: function (xhr, editor) {
        // 请求发生错误
    },
    timeout: function (xhr, editor) {
        // 请求超时
    }
}
```
