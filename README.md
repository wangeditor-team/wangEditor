<b>wangEditor——最轻量化web富文本框！</b>（9kb_javascript + 2kb_css）<br/>
1.1.0版本是经过作者一次彻底的重构的升版，本次重构放弃了bootstrap，同时兼容IE6-IE8，继续使用font-awesome作为字体库。<br />
另外，本次重构是的wangEditor更具有扩展性，使用者可以通过传入自己的配置，来增加wangEditor的功能。<br/>
最后，应用变得更加简单，一句代码搞定！
![](http://images.cnitblog.com/blog/138012/201412/142206280875973.png)  

1. 引用font-awesome和jQuery
===
（初次听说font-awesome的同志们请参见[《请用fontAwesome代替网页icon小图标》](http://www.cnblogs.com/wangfupeng1988/p/4129500.html)）<br />
使用wangEditor首先需要在您的页面中引用`Font-Awesome`图标库和`jQuery`，
如果您的系统中没有以上库，可以直接在上面下载。
```html
<!--引入 fontawesom-4.2.0-->
<link rel="stylesheet" type="text/css" href="fontawesome-4.2.0/css/font-awesome.min.css">
<!--[if IE]>
<link rel="stylesheet" type="text/css" href="fontawesome-4.2.0/css/font-awesome-ie7.min.css">
<![endif]-->

<!--引用jquery-->
<script src="js/jquery-1.10.2.min.js" type="text/javascript"></script>
```

2. 使用wangEditor
===
应用wangEditor非常简单，直接看代码即可。<br/>
```html
<!--引入wangEditor.css-->
<link rel="stylesheet" type="text/css" href="css/wangEditor-1.1.0-min.css">

<!--定义一个div，作为容器-->
<!--其中，div的高度即容器的高度，div其中的内容即富文本框默认显示的内容，o(∩_∩)o -->
<div id='txtDiv' style='border:1px solid #cccccc; height:240px;'>
    <p>请输入内容...</p>
</div>

<!--引入 wangEditor.min.js-->
<script type="text/javascript" src='js/wangEditor-1.1.0-min.js'></script>
<script type="text/javascript">
  $(function () {
    //一句话，即可把一个div 变为一个富文本框！o(∩_∩)o 
    var $editor = $('#txtDiv').wangEditor();

    //其实，返回的 $editor 就是一个jquery对象，你可以这样用：
    //var html = $editor.html();  //获取富文本框的html内容
    //var text = $editor.text();  //获取富文本框的text内容
    //$editor.height(400);  //设置富文本框的高度
    //自由发挥吧。。。 
  });
</script>
```

3. 【插入代码】
===
关于如何用 [wangHighLighter.js](https://github.com/wangfupeng1988/wangHighLighter) 来实现代码高亮，作者将在今日发布并更新。暂时不要着急先！

4. 自定义扩展
===
1.1.0版本的重构，作者考虑到了如何让使用者自定义扩展wangEditor功能。作者将会尽快通过两个非常使用的功能来讲解如何扩展：第一，插入代码；第二，上传图片！敬请期待吧！

4. 交流
===
欢迎加入wangEditor的QQ群交流讨论：164999061<br/>
想要一起合作开发的朋友，可以直接联系本群群主——就是我，哈哈！
