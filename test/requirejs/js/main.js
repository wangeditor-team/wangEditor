require.config({
    paths: {
        jquery: '../../../dist/js/lib/jquery-1.10.2.min',
        wangEditor: '../../../dist/js/wangEditor.min'
    }
});

require(['wangEditor'], function(){
    $(function(){
        var editor = new wangEditor('div1');
        editor.create();
    });
})