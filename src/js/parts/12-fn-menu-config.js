$.extend($E.fn, {
	'initMenuConfig': function(){
		//默认的菜单显示配置
        this.editorMenuConfig = [
            ['viewSourceCode'],
            ['bold', 'underline', 'italic', 'foreColor', 'backgroundColor', 'strikethrough', 'removeFormat'],
            ['blockquote', 'fontFamily', 'fontSize', 'setHead', 'list', 'justify'],
            //['indent', 'outdent'],
            //['insertHr'],
            ['createLink', 'unLink', 'insertTable', 'insertExpression'],
            ['insertImage', 'insertVideo', 'insertLocation','insertCode'],
            ['undo', 'redo', 'fullScreen']
        ];
	}
});