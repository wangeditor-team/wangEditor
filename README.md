wangEditor——基于bootstrap的富文本编辑器。
引用bootstrap和jquery后，你可以用一句代码制作一个富文本编辑器。
而且wangEditor可以插入代码、并高亮显示代码，这可是其他富文本编辑器没有的！<br/>
![](http://images.cnitblog.com/blog/138012/201411/291354308872593.png)  

1. 引用bootstrap和jQuery
===
使用wangEditor首先需要在您的页面中引用`bootstrap`（以及`Font-Awesome`图标库）和`jQuery`，如果您的系统中没有以上库，可以直接在上面下载。
```html
<link href="bootstrap-3.3.0/css/bootstrap.min.css" rel="stylesheet" />
<link href="fontawesome-4.2.0/css/font-awesome.min.css" rel="stylesheet" />

<script src="javascript/jquery-1.10.2.min.js" type="text/javascript"></script>
<script src="bootstrap-3.3.0/js/bootstrap.min.js" type="text/javascript"></script>
```

2. 使用wangEditor
===
引用了`bootstrap`（以及`Font-Awesome`图标库）和`jQuery`之后，就可以使用wangEditor了。<br/>
```html
<div id="divEditor"></div>
<textarea id="txtCode" rows="5" class="form-control"></textarea>

<script src="javascript/wangEditor-1.0.3.min.js" type="text/javascript"></script>
<script type="text/javascript">
  $(function () {
    $('#divEditor').wangEditor({
      $('#divEditor').wangEditor({
            codeTargetId: 'txtCode',              //将源码存储到txtCode
            frameHeight: '300px',                 //默认值为“300px”
            smallBtn: true,                       //默认为false
            initStr: '<p>欢迎使用<b>&lt;wangEditor&gt;</b>！请输入文字...</p>'    //要显示在编辑器中的html源码（用于编辑）
       });
    });
  });
</script>
```
如以上代码：在html中加入一个div，一个textarea；引用wangEditor.min.js；然后执行一步绑定，即可使用wangEditor富文本编辑器！<br/>
编辑器内容的源代码会自动保存到textarea中，可直接用javascript获取，通过ajax保存。如下图：<br/>
![](http://images.cnitblog.com/blog/138012/201411/291400162772608.png)

3. 【插入代码】
===
从wangEditor1.0.2版本开始，应用wangHighLighter.js实现代码高亮功能。wangHighLighter.js是一个单独的代码高亮插件，具体应用可参见[https://github.com/wangfupeng1988/wangHighLighter](https://github.com/wangfupeng1988/wangHighLighter)
<br>
因此，需要在页面中引用wangHighLighter.js：
```html
<script src="js/wangHighLighter-1.0.0-min.js" type="text/javascript"></script>
```
只需要这一步，wangEditor就可以拥有炫酷的代码高亮功能：
![](http://images.cnitblog.com/blog/138012/201411/291402452319968.png)
wangHighLighter.js支持20多种常用语言和9个常用主题风格。

4. 对于低版本浏览器
===
由于bootstrap已经不支持IE8及以下版本浏览器。因此，对于IE8及以下版本浏览器，wangEditor会自动识别，并屏蔽掉富文本编辑功能，只保留简单的编辑框功能。<br/>
编辑器内容的源代码也会自动保存到textarea中，可直接用javascript获取，通过ajax保存。如下图：<br/>
![](http://images.cnitblog.com/blog/138012/201411/102058247884176.png)

4. 交流
===
欢迎加入wangEditor的QQ群交流讨论：164999061<br/>
想要一起合作开发的朋友，可以直接联系本群群主——就是我，哈哈！
