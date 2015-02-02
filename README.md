1. 介绍
===
<b>wangEditor——最轻量级web富文本编辑器，配置方便，使用简单</b>。支持所有PC浏览器（包括IE6）。
demo演示地址：[《wangEditor——轻量级web富文本框》](http://www.cnblogs.com/wangfupeng1988/p/4198428.html#demo)
![](http://images.cnitblog.com/blog/138012/201501/021623557162956.png)

2. 如何使用？
===
<b>2.1 引用fontAwesome和jQuery</b><br/>
wangEditor中的那些漂亮的按钮小图标，不是作者画的，而是引用了当前web上最流星的icon字体库————`fontAwesome`。此时也一并引用`jQuery`。
```
<link rel="stylesheet" type="text/css" href="fontawesome-4.2.0/css/font-awesome.min.css">
<!--[if IE]>
<link rel="stylesheet" type="text/css" href="fontawesome-4.2.0/css/font-awesome-ie7.min.css">
<![endif]-->

<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
```

<b>2.2 引用wangEditor.js和wangEditor.css</b><br/>
使用wangEditor当然要引用它的js和css文件。
```
<link rel="stylesheet" type="text/css" href="css/wangEditor-1.2.0.css">
<script type="text/javascript" src='js/wangEditor-1.2.0.js'></script>
```

<b>2.3 生成富文本框</b><br/>
首先，要在html中建一个`div`。
```
<div id='txtDiv' style='border:1px solid #cccccc; height:240px;'>
    <p>欢迎使用<b>wangEditor</b>，请输入内容...</p>
</div>
```
然后，一句话即可把这个`div`变为富文本框，代码如下。注意，返回的`$editor`其实是一个jQuery对象，可以通过`$editor`获取、更改富文本框中的内容。
```
<script type="text/javascript">
    $(function(){
    	//其实返回的 $editor 就是一个jquery对象，可以进行任何jquery的操作，例如 $editor.html() ， $editor.text()
    	var $editor = $('#txtDiv').wangEditor();
    });
</script>
```

3. 自定义菜单
===
wangEditor支持两种方式的自定义菜单————自定义隐藏某些菜单，强制自定义要显示的菜单。注意，<b>后者会覆盖掉前者</b>！
```
var $editor = $('#txtDiv').wangEditor({
	//配置要隐藏的菜单（数组）
    'hideMenuConfig': ['insertHr', 'uploadImg'],

    //自定义菜单配置（数组）（会覆盖掉'hideMenuConfig'的配置）
    'menuConfig': ['bold', 'italic', '|', 'foreColor', 'backgroundColor']
});
```
wangEditor默认情况下将显示所有的菜单，菜单id如下：
```
[
	'fontFamily', 'fontSize', '|', 
	'bold', 'underline', 'italic', '|', 
	'setHead', 'foreColor', 'backgroundColor', 'removeFormat', '|', 
	'indent', 'outdent', '|',
	'unOrderedList', 'orderedList', '|', 
	'justifyLeft', 'justifyCenter', 'justifyRight', '|', 
	'createLink', 'unLink', '|', 
	'insertHr', 'insertTable',  'insertCode', '|', 
	'webImage', 'uploadImg', '|',
	'undo', 'redo'
]
```
其中，`insertCode`(插入代码)和`uploadImg`(上传图片)默认不会显示出来，这两个菜单需要其他的支持，下文有介绍。

4. 配置“插入代码”功能
===
插入代码`insertCode`按钮默认是不会显示出来的，因为缺少代码高亮插件的支持。要想显示插入代码`insertCode`功能，只需要在页面中引用`wangHighLighter.js`，即可让该菜单显示。
```
<script type="text/javascript" src='js/wangHighLighter-1.0.0-min.js'></script>
```
wangHighLighter.js现在地址：[https://github.com/wangfupeng1988/wangHighLighter](https://github.com/wangfupeng1988/wangHighLighter)<br/>
注意，一定要在引入`wangEditor.js`之前引入，否则无效！

5. 配置“上传图片”功能
===
上传图片`uploadImg`按钮默认不会显示出来，因为缺少上传图片的插件支持。wangEditor中上传图片的功能是通过集成uploadify.js实现的。因此，必须要在页面中引用`uploadify`的js和css，并且配置`uploadify`的参数，即可让该菜单显示。
```
<link href="uploadify/uploadify.css" rel="stylesheet" >
<script src="uploadify/jquery.uploadify.min.js"></script>
```
注意，必须在引入`wangEditor.js`之前引入，否则无效！
<br/>
引入`uploadify`之后，需要配置`uploadify`，在wangEditor()方法中配置即可。
```
var $editor = $('#txtDiv').wangEditor({
	'uploadifyConfig':{
		height: 30,
		width: 120,
		swf: 'uploadify/uploadify.swf',
		uploader: 'data.ashx',
		buttonText: '选择图片'
    	//其他自定义的uploadify配置项……
    },
});
```

6. 交流
===
交流QQ群：<b>164999061</b> <br />
二次开发联系：<b>wangfupeng1988#163.com（#->@）</b>