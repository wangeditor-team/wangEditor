$.fn.extend({
    /*
    * options: {
    *   menuConfig: [...],   //配置要显示的菜单（menuConfig会覆盖掉hideMenuConfig）
    *   onchange: function(){...},  //配置onchange事件，
    *   expressions: [...],  //配置表情图片的url地址
    *   uploadImgComponent : $('#someId'),  //上传图片的组件
    *   uploadUrl: 'string'  //图片上传的地址
    * }
    */
    'wangEditor': function(options){
        if(this[0].nodeName !== 'TEXTAREA'){
            //只支持textarea
            alert('wangEditor提示：请使用textarea扩展富文本框。');
            return;
        }

        //针对一个textarea不能执行两遍 wangEditor() 事件
        if(this.data('wangEditorFlag')){
            alert('针对一个textarea不能执行两遍wangEditor()事件');
            return;
        }else{
            this.data('wangEditorFlag', true);
        }

        options = options || {};

        //获取editor对象
        var editor = $E(this, options);

        //渲染editor，并隐藏textarea
        this.before(editor.$editorContainer);
        this.hide();

        //页面刚加载时，初始化selection
        editor.initSelection();

        //返回editor对象
        return editor;
    }
});