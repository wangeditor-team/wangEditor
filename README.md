第一，引用bootstrap（以及font-awesome图标库）和jQuery：
<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="Font-Awesome-3.2.1/css/font-awesome.min.css" rel="stylesheet" />

<script src="javascript/jquery-1.10.2.min.js" type="text/javascript"></script>
<script src="bootstrap/js/bootstrap.min.js" type="text/javascript"></script>

第二，引用wangEditor.min.js：
<script src="javascript/wangEditor-1.0.0.min.js" type="text/javascript"></script>

第三，应用wangEditor：
<div id="divEditor"></div>
<textarea id="txtCode" rows="5" cols="50" style="width:100%"></textarea>
<script type="text/javascript">
    $(function () {
      $('#divEditor').wangEditor({
        codeTargetId: 'txtCode',              //将源码存储到txtCode
        frameHeight: '200px',                 //默认值为“300px”
        initWords: '欢迎使用！请输入文字...',  //默认值为“请输入...”
        showInfo: true                        //是否显示“关于”菜单，默认显示
      });
    });
</script>
