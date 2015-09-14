require.config({
    paths: {
        jquery: '../../dist/js/jquery-1.10.2.min',
        wangEditor: '../../dist/js/wangEditor-1.3.9.min'
    }
});

require(['wangEditor'], function(){
	$(function(){
		var editor = $('#textarea1').wangEditor();
	});
});