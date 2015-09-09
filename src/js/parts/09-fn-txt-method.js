$.extend($E.fn, {
	//往menu中插入btn Group
    'insertMenuGroup': function($btnGroup){
        this.$btnContainer.append($btnGroup);
        this.menuGroupLength  += 1;
    },

    //插入modal弹出层
    'insertModal': function($modal){
        this.$modalContainer.append($modal);
    },

    //为$txt绑定监听事件
    'bindEventFor$txt': function(type, fn){
        this.$txt.on(type, fn);
    },

    //读取或设置html
    'html': function(html){
        if(html == null){
            return this.$txt.html();
        }else if(typeof html === 'string'){
            this.$txt.html(html);

            //主动执行change事件
            this.change();
        }
    },

    //获取text（不包含html标签）
    'text': function(){
        return this.$txt.text();
    },

    //追加内容
    'append': function($elem){
        if($elem == null){
            return;
        }
        if(typeof $elem === 'string'){
            $elem = '<div>' + $elem + '</div>';
            this.$txt.append( $($elem) );
        }
        if($elem instanceof $){
            this.$txt.append($elem);
        }

        //主动执行change事件
        this.change();
    },

    //设置textarea的值
    'textareaVal': function(val){
        if(val || val === ''){
            this.$textarea.val(val);
        }else{
            return this.$textarea.val();
        }
    },

    //隐藏modal
    'hideModal': function(){
        this.$modalContainer.find('.wangEditor-modal:visible').hide();

        //经测试，safari浏览器菜单按钮检测不到blur事件
        //因此，只能强制隐藏dropmenu和droppanel
        this.$btnContainer.find('.wangEditor-drop-panel:visible').hide();
        this.$btnContainer.find('.wangEditor-drop-menu:visible').hide();
    },

    //获取editor Container
    'getEditorContainer': function(){
        return this.$editorContainer;
    },

    //让编辑器失去焦点
    'blur': function(){
        this.$txt.blur();
    },

    //让编辑器获取焦点
    'focus': function(){
        this.$txt.focus();
    },

    //隐藏编辑器
    'hide': function(){
        this.$editorContainer.hide();
    },

    //显示编辑器
    'show': function(){
        this.$editorContainer.show();
    }
});