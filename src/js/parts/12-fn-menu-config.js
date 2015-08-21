$.extend($E.fn, {
	'initMenuConfig': function(){
		//默认的菜单显示配置
        this.editorMenuConfig = [
            ['viewSourceCode'],
            ['fontFamily', 'fontSize'],
            ['bold', 'underline', 'italic'],
            ['setHead', 'foreColor', 'backgroundColor', 'removeFormat'],
            //['indent', 'outdent'],
            ['unOrderedList', 'orderedList'],
            ['justifyLeft', 'justifyCenter', 'justifyRight'] ,
            ['createLink', 'unLink', 'insertExpression', 'insertVideo'],
            ['insertHr', 'insertTable', 'webImage', 'uploadImg', 'insertLocation','insertSimpleCode'],
            ['undo', 'redo'],
            ['fullScreen']
        ];
	}
});