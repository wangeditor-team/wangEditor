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

## 限制一次最多能传几张图片

默认为 10000 张（即不限制），需要限制可自己配置

```javascript
// 限制一次最多上传 5 张图片
editor.customConfig.uploadImgMaxLength = 5
```

## 自定义上传参数

上传图片时可自定义传递一些参数，例如传递验证的`token`等。这些参数会拼接到 url 的参数中，也会被添加到`formdata`中。

```javascript
editor.customConfig.uploadImgParams = {
    token: 'abcdef12345'  // 属性值会自动进行 encode ，此处无需 encode
}
```

## 自定义 fileName

上传图片时，可自定义`filename`，即在使用`formdata.append(name, file)`添加图片文件时，自定义第一个参数。

```javascript
editor.customConfig.uploadFileName = 'yourFileName'
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

默认的 timeout 时间是 10 秒钟

```javascript
// 将 timeout 时间改为 3s
editor.customConfig.uploadImgTimeout = 3000
```

## 监听函数

可使用监听函数在上传图片的不同阶段做相应处理

```javascript
editor.customConfig.uploadImgHooks = {
    before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
    },
    success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    },
    fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
    },
    error: function (xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
    },
    timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
    },

    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
    customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var url = result.url
        insertImg(url)

        // result 必须是一个 JSON 格式字符串！！！否则报错
    }
}
```

## 自定义提示方法

上传图片的错误提示默认使用`alert`弹出，你也可以自定义用户体验更好的提示方式

```javascript
editor.customConfig.customAlert = function (info) {
    // info 是需要提示的内容
    alert('自定义提示：' + info)
}
```

## 自定义上传图片事件

如果想完全自己控制图片上传的过程，可以使用如下代码

```javascript
editor.customConfig.customUploadImg = function (files, insert) {
    // files 是 input 中选中的文件列表
    // insert 是获取图片 url 后，插入到编辑器的方法

    // 上传代码返回结果之后，将图片插入到编辑器中
    insert(imgUrl)
}
```
