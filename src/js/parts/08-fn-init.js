$.extend($E.fn, {

    //初始化函数
    'init': function($textarea, options){
        /*
        * options: {
        *   menuConfig: [...],   //配置要显示的菜单（menuConfig会覆盖掉hideMenuConfig）
        *   onchange: function(){...},  //配置onchange事件，
        *   expressions: [...],  //配置表情图片的url地址
        *   uploadImgComponent : $('#someId'),  //上传图片的组件
        *   uploadUrl: 'string',  //跨域图片上传的地址
        *   pasteUrl: 'string',  //粘贴图片上传的地址
        *   lang: '...' / {...}  //语言包
        * }
        */

        var //options
            onchange = options.onchange,
            menuConfig = options.menuConfig,
            expressions = options.expressions,
            uploadImgComponent = options.uploadImgComponent,
            uploadUrl = options.uploadUrl,
            pasteUrl = options.pasteUrl,
            lang = options.lang,

            //editor
            editor = this,
            height = $textarea.height(),
            maxHeight = $textarea.css('max-height'),
            initVal = $.trim( $textarea.val() );

        //设置id
        var id = $textarea.attr('id');
        if(!id){
            id = $E.getUniqeId();
        }
        editor.id = id;

        //创建基础DOM实体对象，并组合
        editor.$editorContainer = $( $E.htmlTemplates.editorContainer );
        editor.$btnContainer = $( $E.htmlTemplates.btnContainer );
        editor.$modalContainer = $( $E.htmlTemplates.modalContainer );
        editor.$txtContainer = $( $E.htmlTemplates.txtContainer );
        editor.$txt = $( $E.htmlTemplates.txt );
        editor.$textarea = $textarea;
        editor.$elemDeleteBtn = $( $E.htmlTemplates.elemDeleteBtn );  //元素左上角的删除按钮
        editor.$imgResizeBtn = $( $E.htmlTemplates.imgResizeBtn );  //img右下角的resize按钮

        editor.$txtContainer.append(editor.$txt);
        editor.$editorContainer
            .append(editor.$btnContainer)
            .append(editor.$modalContainer)
            .append(editor.$txtContainer)
            .append(editor.$elemDeleteBtn)
            .append(editor.$imgResizeBtn);

        //设置高度的最小值（再小了，文本框就显示不出来了）
        if(height <= 80){
            height = 80;
        }
        if( parseInt(maxHeight) <= height || !maxHeight ){
            //保证 maxHeight 是一个有效值
            maxHeight = 'none';
        }
        //设置高度（必须在dom渲染完之后才行）
        $(function(){
            //计算txtContainer的高度，必须等待页面加载完成才能计算，否则dom没有被渲染，无法计算高度
            var txtContainerHeight = height - editor.$btnContainer.outerHeight(); 
            txtContainerHeight = txtContainerHeight - 2;  //减去$editorContainer的上下两个边框宽度
            
            if(txtContainerHeight <= 0){
                //有时候，页面加载时，txtContainerHeight 会莫名其妙的变为负值
                //强制刷新页面之后，又恢复正常
                txtContainerHeight = height - 32;
            }

            if(typeof maxHeight === 'string' && maxHeight !== 'none'){
                //设置最大高度
                editor.$txtContainer.css('max-height', maxHeight);
            }else{
                //设置绝对高度
                editor.$txtContainer.height( txtContainerHeight );
            }
            
            //设置 txt 的高度
            editor.$txt.css('min-height', (txtContainerHeight - 10) + 'px');
        });

        //设置为readonly
        if( $textarea.prop('readonly') ){
            editor.$txt.attr('contenteditable', false);
        }

        //绑定onchange函数
        if(onchange && typeof onchange === 'function'){
            editor.onchange = onchange;
        }

        //绑定表情图片配置
        if(expressions && expressions.length && expressions.length > 0){
            editor.expressions = expressions;
        }

        //配置语言包
        //要在初始化menus之前
        //要在init跨域图片上传组件之前
        editor.initLang(lang);

        //跨域上传图片的url
        if(uploadUrl && typeof uploadUrl === 'string'){
            editor.uploadUrl = uploadUrl;
            //获取跨域上传图片的组件
            editor.uploadImgComponent = $E.getUploadImgComponentForCrossDomain(editor);
        }

        //上传图片的组件啊
        if(uploadImgComponent){
            editor.uploadImgComponent = uploadImgComponent;
        }

        //初始化menus
        editor.initMenus();
        editor.initMenuConfig();
        
        //配置menuConfig
        if(menuConfig && (menuConfig instanceof Array) === true && (menuConfig[0] instanceof Array) === true){  //需要确定menuConfig是二维数组才行
            //如果options中配置了menuConfig，直接复制给 editor.editorMenuConfig
            editor.editorMenuConfig = menuConfig;
        }

        //初始化菜单组的数量（会在菜单组创建时候被修改）
        editor.menuGroupLength = 0;
        //创建menu
        $.each(editor.editorMenuConfig, function(key, menuGroup){
            $E.createMenuGroup(menuGroup, editor);
        });

        //如果只有一个菜单组，则隐藏该菜单组的 border-right
        if(editor.menuGroupLength === 1){
            editor.$btnContainer.children().first().css('border-right', '0');
        }

        //定义$txt监听函数----------------------------
        function txtListener(e){
            editor.saveSelection();   //保存选中范围
            editor.updateMenuStyle();  //更新菜单样式

            if(e && e.type === 'focus'){
                //focus只能执行一次监听——页面一加载时$txt被强制执行focus()，而剩下的监听都会由click和keyup代替
                editor.$txt.off('focus', txtListener);
            }
        }
        //绑定$txt的focus、mousedown、click、keyup、blur事件
        editor.$txt.on('focus', txtListener)
        .on('mousedown', function(){
            //当鼠标按下时，可能会拖拽选择，这就有可能拖拽到$txt外面再松开，需要监控
            editor.$txt.on('mouseleave', function(){
                //鼠标拖拽到外面再松开的
                editor.$txt.off('mouseleave'); 
                setTimeout(txtListener, 100);  //缓0.1s，否则鼠标移动太快的话，选不全
            });
        }).on('click keyup', function(e){
            var keyForMoveCursor = false,
                //上、下、左、右、home、end、pageup、pagedown、ctrl + a
                kCodes = [33, 34, 35, 36, 37, 38, 39, 40, 13, 8, 46, 9, 65]; 
            keyForMoveCursor = ( e.type === 'click' || (e.type === 'keyup' && (kCodes.indexOf(e.keyCode) !== -1) || e.ctrlKey || e.shiftKey || e.metaKey) );
            if (!keyForMoveCursor) {
                return;  //只监听click, 和 kCodes 中的这几个键，其他的不监听
            }
            txtListener();

            if(e.type === 'click'){
                //鼠标未被按住拖拽到外面再松开，而是在$txt里面就松开了
                editor.$txt.off('mouseleave');
            }
        }).on('focus blur', function(){
            //focus blur 时记录，以便撤销
            editor.addCommandRecord();
        }).on('keydown', function(e){
            if(e.keyCode === 9){
                //按tab键，增加缩进
                editor.command(e, 'insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });

        //初始化特定元素左上角的删除按钮------------------
        if(isIE || isFireFox){
            //IE和firefox不用为img增加删除按钮
            editor.initDeleteBtn('table');
        }else{
            editor.initDeleteBtn('img,table');
        }

        //初始化img右下角的resize按钮------------------
        if(!isIE && !isFireFox){
            //IE和firefox自带resize功能
            editor.initImgResizeBtn('img');
        }

        //配置编辑器语言
        editor.initLang(lang);

        //绑定paste事件
        editor.bindPaste(pasteUrl);

        //txtContainer和btnContainer被点击时，要隐藏modal
        editor.$txtContainer.click(function(){
            editor.hideModal();
        });
        editor.$btnContainer.click(function(){
            editor.hideModal();
        });

        //初始化时记录，以便撤销------------------
        editor._initCommandRecord();

        //记录当前html，否则未修改就会触发change事件------------------
        editor.latestHtml = editor.html();

        //$txt blur时，触发change------------------
        editor.$txt.blur(function(){
            //blur时监控变化
            editor.change();
        });

        //如果textarea有内容，则作为初始值
        if(initVal){
            editor.$txt.html(initVal);
            editor.change();
        }

        //编辑区域自动获取焦点
        editor.$txt.focus();

        //返回------------------
        return editor;
    },
    
});