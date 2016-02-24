define(function(require, exports, module){
    var $ = require('jquery');
    require('wangEditor')($);

    $(function(){
        var editor = new wangEditor('div1');
        editor.create();
    });
});