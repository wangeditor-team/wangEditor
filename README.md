0. 本次更新说明
===
更新时间为：2015-05-15，更新版本为1.3.0版。近期更新的主要内容：<br/>
* editor.append([data]) 方法支持传入字符串；
* 支持自定义配置表情图片；
* 增加“查看源码”功能；
* 使用Grunt重构开发环境；
* 增加插入视频的功能；

1. 介绍
===
<b>wangEditor——轻量级web富文本编辑器，配置方便，使用简单</b>。支持IE6+浏览器。<br/>

* 软件官网：[www.wangEditor.com](http://www.wangEditor.com)
* demo演示：[www.wangeditor.com/wangEditor/demo/demo.html](http://www.wangeditor.com/wangEditor/demo/demo.html)

![](http://images.cnitblog.com/blog2015/138012/201504/092122513835286.png)

2. 如何使用？
===
引用wangEditor.css、jquery.js和wangEditor.js之后，一行代码即可把textarea变为富文本框，简单易用。
```javascript
$(function(){
	$('#textarea1').wangEditor();
});
```
如果想要在一个页面创建多个富文本编辑器，也很简单（源码中<code>demo-multi-text.html</code>页面有演示）。
```javascript
//先在html中定义两个textarea，然后：
$(function(){
    $('#textarea1').wangEditor();
    $('#textarea2').wangEditor();
});
```
在基本应用的基础上，wangEditor还支持自定义配置：
```javascript
$('#textarea1').wangEditor({
	'$initContent': ...    //配置要初始化的内容
	'menuConfig': ...      //配置要显示的菜单（其他的隐藏）
	'onchange': ...        //配置onchange事件
    'expressions': ...     //配置表情图片
	'uploadUrl': ...       //配置上传图片的Url
});
```
wangEditor支持如下配置：
* <code>demo.html</code> （demo演示）
* <code>demo-basic.html</code> （基本配置说明）
* <code>demo-getValue.html</code>（获取富文本的源码值）
* <code>demo-initContent.html</code> （配置初始化时要显示的内容）
* <code>demo-menuConfig.html</code> （配置要显示的菜单按钮，其他的隐藏）
* <code>demo-onchange.html</code> （配置onchange事件）
* <code>demo-uploadImg.html</code> （配置图片上传）
* <code>demo-append.html</code>（手动追加内容）
* <code>demo-html.html</code>（手动修改html内容）
* <code>demo-expressions.html</code>（配置表情图片）
具体的配置说明，可以在网站的文档页面[http://www.wangeditor.com/doc.html](http://www.wangeditor.com/doc.html)中查看。

3. 交流
===
交流QQ群：<b>164999061</b> <br />
二次开发联系：<b>wangfupeng1988#163.com（#->@）</b>