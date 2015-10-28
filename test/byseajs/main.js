define(function(require, exports, module){
	var $ = require('jquery');
	require('wangEditor')($);

	$(function(){
		var editor = $('#textarea1').wangEditor();
	});
});