
## 修改wangEditor并实现图片上传至阿里云对象存储OSS


`注: 源码修改部分全部通过注释标明位置(可通过搜索关键字: '[变动 -')`  
`共分为两种方式标注:`  
1. `[变动 - 新增n]` n为不同的数字区分新增部分
2. `[变动 - 修改n]` n为不同的数字区分修改部分


## 变动内容

- 新增配置项
```javascript
// [变动 - 新增1] 如果是多张图片是否一次上传所有还是一次一张, 默认 true
allImgTransfer: true,
// [变动 - 新增7] 图片的formData键名(仅当allImgTransfer为false时有效), 默认为 file
formDataImgKey: 'file',
// [变动 - 新增2] 是否对参数进行编码, 默认为 true
isEncodeParam: true,
// [变动 - 新增3] 显示formdata, 默认为 true
debugFormData: true,
```

- 新增原型方法
```javascript
// [变动 - 新增5] 自定义图片上传附带的参数
setUploadImgParams: function setUploadImgParams(obj) {
    if(obj instanceof Object) {
        this.config.uploadImgParams = Object.assign(this.config.uploadImgParams || {} , obj);
    }
},
```

- 图片上传之前的事件回调去除了XMLHttpRequst对象参数  
原回调参数有三个:  
`xhr: XMLHttpRequst对象，editor: 编辑器对象，files: 选择的图片文件`  
现回调参数少了一个(去除了xhr参数):  
`editor: 编辑器对象，files: 选择的图片文件`  


- 修复oss上传的小问题(不影响原代码)  
    1. POST参数问题  
        去除原代码对参数的编码: `val = encodeURIComponent(val);`  
        故添加了`isEncodeParam`配置项来控制是否需要编码
    2. FormData值顺序问题
        改变原来的图片数据设置位置下移
        ```javascript
        arrForEach(resultFiles, function (file) {
            ...
        }
        ```
    3. 多图上传问题
        把原来的XMLHttpRequest请求单独写在一个函数内, 以便多次调用



## OSS图片上传代码示例

#### 完成用wangEditor上传图片至OSS需完成三个步骤(以PHP为例)

1. 服务端生成oss.policy等数据的api  
[阿里云oss上传文档](https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.6.632.59ghFM '阿里云oss上传文档')

2. 服务端的oss图片上传的回调  
[阿里云oss回调文档](https://help.aliyun.com/document_detail/31989.html?spm=a2c4g.11186623.6.903.uz6Zwf '阿里云oss回调文档')

3. js代码
```javascript
//初始化wangEditor编辑器
var E = window.wangEditor;
var editor = new E('#editor');
//[注意:] 上传地址 如: http://abc.oss-cn-beijing.aliyuncs.com/
editor.customConfig.uploadImgServer = '[oss外网访问地址]';
//不允许插入网络图片
editor.customConfig.showLinkImg    = false;
//[必须:] 不对参数进行编码
editor.customConfig.isEncodeParam  = false;
//[必须:] 让多张图片变成一张一张的上传
editor.customConfig.allImgTransfer = false;
editor.customConfig.uploadImgHooks = {
    before: function (editor, files) {
        // 图片上传之前触发
        // [注意:] 原来的第一个参数已去除
        // editor 是编辑器对象，files 是选择的图片文件
        
        var ret = null;

        // 这里使用阻塞请求数据后进行修改图片的参数
        // 也可使用其他方法, 只要保证要发送图片之前完成参数赋值即可
        $.ajax({
            url: '/get_oss_policy',
            type: 'GET',             // method
            async: false,    	     // 是否异步, [注意:]这里使用同步获取
            data: {},
            timeout: 3000,    	     // 超时时间
            dataType: 'json',        // 返回的数据格式：json/xml/html/script/jsonp/text
            success:function(data, textStatus){
                if(data && (data instanceof Object)) ret = data;
            },
            error:function(xhr, textStatus, exc){
                console.log('获取失败: ', textStatus);
            },
        });
        // console.log(ret);
        if(ret && ret.accessid && ret.signature && ret.policy) {
            var obj = {
                'key': ret.dir + '${filename}',
                'policy': ret.policy,
                'OSSAccessKeyId': ret.accessid,
                'success_action_status': '200',
                'callback': ret.callback,
                'signature': ret.signature,
            };
            
            // 这里另添加了一个原型方法, 供修改图片参数的方法
            editor.setUploadImgParams(obj);
        }else {
            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            return {
                prevent: true,
                msg: '无法获取oss上传信息',
            }
        }

    },
    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
    customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        if(result && result.url) insertImg(result.url);
    },
};
editor.create();
```
