0. 本次更新说明
===
更新时间为：2015-03-08，更新版本为1.2版。本次更新的主要内容：<br/>
第一，摆脱了对fontAwesome字体库的依赖，作者自己封装了的字体库，直接集成在wangEditor中，不用再引用fontAwesome。<br/>
第二，不再使用uploadify作为图片上传的工具（会导致新版chrome崩溃），后续版本作者将自己开发拖拽上传图片的功能，敬请期待。


1. 介绍
===
<b>wangEditor——最轻量级web富文本编辑器，配置方便，使用简单</b>。支持IE7+浏览器（IE6优化正在调整中……）。
demo演示地址：[《wangEditor——轻量级web富文本框》](http://www.cnblogs.com/wangfupeng1988/p/4198428.html#demo)
![](http://images.cnitblog.com/blog/138012/201502/022125432037564.png)

2. 如何使用？
===

<b>2.1 引用wangEditor.js和wangEditor.css</b><br/>
使用wangEditor当然要引用它的js和css文件。
```html
<link rel="stylesheet" type="text/css" href="css/wangEditor-1.2.css">
<!--[if IE]>
<link rel="stylesheet" type="text/css" href="css/wangEditorFont-ie7-1.2.css">
<![endif]-->
<script type="text/javascript" src='js/wangEditor-1.2.js'></script>
```

<b>2.2 生成富文本框</b><br/>
首先，要在html中建一个`div`。注意，这个`div`必须设置`id='wangEditorTxt'`。
```html
<!-- 注意，下一行 id='wangEditorTxt' 是必须的！ -->
<div id='wangEditorTxt' style='border:1px solid #cccccc; height:240px;'>
    <p>欢迎使用<b>wangEditor</b>，请输入内容...</p>
</div>
```
然后，一句话即可把这个`div`变为富文本框，代码如下。注意，返回的`$editor`其实是一个jQuery对象，可以通过`$editor`获取、更改富文本框中的内容。
```html
<script type="text/javascript">
    $(function(){
    	//其实返回的 $editor 就是一个jquery对象，可以进行任何jquery的操作，例如 $editor.html() ， $editor.text()
    	var $editor = $('#wangEditorTxt').wangEditor();
    });
</script>
```

3. 自定义菜单
===
wangEditor支持两种方式的自定义菜单————自定义隐藏某些菜单，强制自定义要显示的菜单。注意，<b>后者会覆盖掉前者</b>！
```javascript
var $editor = $('#wangEditorTxt').wangEditor({
	//配置要隐藏的菜单（数组）
    'hideMenuConfig': ['insertHr', 'insertTable'],

    //自定义菜单配置（数组）（会覆盖掉'hideMenuConfig'的配置）
    'menuConfig': ['bold', 'italic', '|', 'foreColor', 'backgroundColor']
});
```
wangEditor默认情况下将显示所有的菜单，菜单id如下：
```javascript
[
	'fontFamily', 'fontSize', '|', 
	'bold', 'underline', 'italic', '|', 
	'setHead', 'foreColor', 'backgroundColor', 'removeFormat', '|', 
	'indent', 'outdent', '|',
	'unOrderedList', 'orderedList', '|', 
	'justifyLeft', 'justifyCenter', 'justifyRight', '|', 
	'createLink', 'unLink', '|', 
	'insertHr', 'insertTable',  'insertCode', '|', 
	'webImage', '|',
	'undo', 'redo'
]
```
其中，`insertCode`(插入代码)默认不会显示出来，它需要其他的支持，下文有介绍。

4. 配置“插入代码”功能
===
插入代码`insertCode`按钮默认是不会显示出来的，因为缺少代码高亮插件的支持。要想显示插入代码`insertCode`功能，只需要在页面中引用`wangHighLighter.js`，即可让该菜单显示。
```html
<script type="text/javascript" src='js/wangHighLighter-1.0.0-min.js'></script>
```
wangHighLighter.js现在地址：[https://github.com/wangfupeng1988/wangHighLighter](https://github.com/wangfupeng1988/wangHighLighter)<br/>
注意，一定要在使用`wangEditor`之前引入，否则无效！

5. 如何过滤XSS？
===
xss是现在网络攻击的常用手段，尤其对于富文本框来说，过滤xss是非常重要的一份工作。术业有专攻，wangEditor不是过滤xss的专家，但是可以借助专家的力量。<br />
<b>因此，强烈建议大家引用`xss.js`，wangEditor已经做好集成工作，只需要页面引用即可。</b> <br />
下载地址：[https://raw.github.com/leizongmin/js-xss/master/dist/xss.js](https://raw.github.com/leizongmin/js-xss/master/dist/xss.js)
```html
<script type="text/javascript" src="js/xss.js"></script>
```

6. 交流
===
交流QQ群：<b>164999061</b> <br />
二次开发联系：<b>wangfupeng1988#163.com（#->@）</b>