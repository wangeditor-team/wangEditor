# 上传到七牛云存储

完整的 demo 请参见 https://github.com/wangfupeng1988/js-sdk ，可下载下来本地运行 demo

> 注意：七牛云的JDK需要自行引入

核心代码如下：

```js
import * as Qiniu from "qiniu-js";

var E = window.wangEditor
var editor = new E('#div1')
// 允许上传到七牛云存储
editor.customConfig.uploadImgChannel = 'qiniu'
    editor.customConfig.qiniu = {
        handle:Qiniu,  // 引入的七牛jdk 对象
        keygen: function(){
            // 自定义函数，从服务端获取七牛上传用的 key 和 token
            return {'key':'','token':''};
        },
        // 自定义返回格式。因为七牛一次只上传单张，所以此函数只需返回一个图片地址字符串
        // customResult: function(res){
        //     if(res.code == 200){
        //         return res.data.url
        //     }
        // }
    }
editor.create()


```
