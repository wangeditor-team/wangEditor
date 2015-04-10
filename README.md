0. 本次更新说明
===
更新时间为：2015-04-09，更新版本为1.3版。本次更新的主要内容：<br/>
* 优化IE6、7兼容性的处理；
* 修改选择颜色的样式；
* 不再使用word风格；

1. 介绍
===
<b>wangEditor——轻量级web富文本编辑器，配置方便，使用简单</b>。支持IE6+浏览器。<br/>

* 软件官网：[www.wangEditor.com](http://www.wangEditor.com)
* demo演示：[www.wangeditor.com/wangEditor/demo.html](http://www.wangeditor.com/wangEditor/demo.html)

![](http://images.cnitblog.com/blog2015/138012/201504/092122513835286.png)

2. 如何使用？
===
引用wangEditor.css、jquery.js和wangEditor.js之后，一行代码即可把textarea变为富文本框，简单易用。
```javascript
$(function(){
	$('#textarea1').wangEditor();

	//想要获取编辑框的内容，只需要取得textarea的内容即可
	var html = $('#textarea1').val();
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
	'uploadUrl': ...       //配置上传图片的Url
});
```
具体的配置说明，可下载源码，源码中相应的demo页面有详细使用说明。
* <code>demo.html</code> （demo演示）
* <code>demo-basic.html</code> （基本配置说明）
* <code>demo-initContent.html</code> （配置初始化时要显示的内容）
* <code>demo-menuConfig.html</code> （配置要显示的菜单按钮，其他的隐藏）
* <code>demo-onchange.html</code> （配置onchange事件）
* <code>demo-uploadImg.html</code> （配置图片上传）

3. 自定义主题颜色
===
wangEditor默认的主题颜色为深灰色，你也可以自定义符合网站主题风格的颜色。<br>
找到<code>css/wangEditor-1.3.less</code>文件，搜索<code>“begin：颜色配置”</code>关键字，然后你就可以找到wangEditor的所有颜色配置。在这里自由发挥的修改吧！<br>
**最后不要忘记，把<code>less</code>编译成<code>css</code>**。
```less
//-----------------------------------begin：颜色配置-----------------------------------

//开发者可自定义以下颜色。通过定义颜色，可实现不同的主题风格。

@editor-container-border-color:#ccc;        //整个编辑器外边框的颜色

@fore-color:#505050;                        //默认字体颜色、按钮颜色
@reverse-color:#fff;                        //反转后的字体颜色、按钮颜色（如按钮tooltip中的字体颜色）
@selected-bg-color:#aec5e6;                 //按钮选中时的背景色

@btn-container-bg-color:#f3f3f3;            //菜单按钮容器的背景色
@btn-container-border-color:#d2d4d1;        //菜单按钮容器的边框颜色

@txt-container-bg-color:#dfdfdf;            //编辑框容器的背景色
@txt-border-color:#a8aaa7;                  //编辑框边框颜色
@txt-bg-color:#fff;                         //编辑框背景色
//-----------------------------------end:颜色配置-----------------------------------
```

4. 交流
===
交流QQ群：<b>164999061</b> <br />
二次开发联系：<b>wangfupeng1988#163.com（#->@）</b>