var BMap; //百度地图构造函数（为了应对jshint检查，其实没有也可以照常运行）
var define;

(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define('wangEditor', ["jquery"], factory);
    } else {
        // 全局模式
        factory(window.jQuery);
    }
})(function($){
$(function(){
    //判断IE6、7、8
    var isIE6 = false, 
        isIE7 = false, 
        isIE8 = false,
        appVersion;
    if(navigator.appName === "Microsoft Internet Explorer"){
        appVersion = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
        isIE6 = appVersion === 'MSIE6.0';
        isIE7 = appVersion === 'MSIE7.0';
        isIE8 = appVersion === 'MSIE8.0';
    }
    if(isIE6 || isIE7 || isIE8){
        //只针对IE6、7、8
        window.onload = function() {
            function addIcon(elem, entity) {
                elem.className = '';
                elem.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>';
            }
            var icons = {
                'icon-wangEditor-link' : '&#xe800;',
                'icon-wangEditor-unlink' : '&#xe801;',
                'icon-wangEditor-code' : '&#xe802;',
                'icon-wangEditor-cancel': '&#xe803;',
                'icon-wangEditor-terminal':'&#xe804;',
                'icon-wangEditor-angle-down':'&#xe805;',
                'icon-wangEditor-font':'&#xe806;',
                'icon-wangEditor-bold':'&#xe807;',
                'icon-wangEditor-italic':'&#xe808;',
                'icon-wangEditor-header':'&#xe809;',
                'icon-wangEditor-align-left':'&#xe80a;',
                'icon-wangEditor-align-center':'&#xe80b;',
                'icon-wangEditor-align-right':'&#xe80c;',
                'icon-wangEditor-list-bullet':'&#xe80d;',
                'icon-wangEditor-indent-left':'&#xe80e;',
                'icon-wangEditor-indent-right':'&#xe80f;',
                'icon-wangEditor-list-numbered':'&#xe810;',
                'icon-wangEditor-underline':'&#xe811;',
                'icon-wangEditor-table':'&#xe812;',
                'icon-wangEditor-eraser':'&#xe813;',
                'icon-wangEditor-text-height':'&#xe814;',
                'icon-wangEditor-brush':'&#xe815;',
                'icon-wangEditor-pencil':'&#xe816;',
                'icon-wangEditor-minus':'&#xe817;',
                'icon-wangEditor-picture':'&#xe818;',
                'icon-wangEditor-file-image':'&#xe819;',
                'icon-wangEditor-cw':'&#xe81a;',
                'icon-wangEditor-ccw':'&#xe81b;',
                'icon-wangEditor-music':'&#xe911;',
                'icon-wangEditor-play':'&#xe912;',
                'icon-wangEditor-location':'&#xe947;',
                'icon-wangEditor-happy':'&#xe9df;',
                'icon-wangEditor-sigma':'&#xea67',
                'icon-wangEditor-enlarge2':'&#xe98b;',
                'icon-wangEditor-shrink2':'&#xe98c;',
                'icon-wangEditor-newspaper':'&#xe904;',
                'icon-wangEditor-camera':'&#xe90f;',
                'icon-wangEditor-video-camera':'&#xe914;',
                'icon-wangEditor-file-zip':'&#xe92b;',
                'icon-wangEditor-stack':'&#xe92e;',
                'icon-wangEditor-credit-card':'&#xe93f;',
                'icon-wangEditor-address-book':'&#xe944;',
                'icon-wangEditor-envelop':'&#xe945;',
                'icon-wangEditor-drawer':'&#xe95c;',
                'icon-wangEditor-download':'&#xe960;',
                'icon-wangEditor-upload':'&#xe961;',
                'icon-wangEditor-lock':'&#xe98f;',
                'icon-wangEditor-unlocked':'&#xe990;',
                'icon-wangEditor-wrench':'&#xe991;',
                'icon-wangEditor-eye':'&#xe9ce;',
                'icon-wangEditor-eye-blocked':'&#xe9d1;',
                'icon-wangEditor-command':'&#xea4e;',
                'icon-wangEditor-font2':'&#xea5c;',
                'icon-wangEditor-libreoffice':'&#xeade;',
                'icon-wangEditor-quotes-left':'&#xe977;',
                'icon-wangEditor-strikethrough':'&#xea65;'
            };

            //遍历菜单按钮，替换fontIcon
            $('.wangEditor-container i').each(function(){
                var elem = this,
                    className = this.className,
                    matchs = className.match(/icon-wangEditor-[^\s'"]+/);
                if (matchs) {
                    addIcon(elem, icons[matchs[0]]);
                }
            });
        };
    } 
});
//检测jquery是否正常
if(!$){
	alert('检测到页面没有引用jQuery，请先引用，否则wangEditor将无法使用。');
    return;
} else if(typeof $ !== 'function' || /^\d+\.\d+\.\d+$/.test($().jquery) === false){
	alert('检测到 window.jQuery 已被修改，wangEditor无法使用。');
    return;
}
//------------------------------------定义全局变量------------------------------------
var document = window.document,
    $document = $(document),
    $window = $(window),
    $body = $('body'),

    //是否支持W3C的selection操作？
	supportRange = typeof document.createRange === 'function',
    //浏览器类型
    isIE = !!window.ActiveXObject || "ActiveXObject" in window,  //包括IE11
    isFireFox = navigator.userAgent.indexOf("Firefox") > 0,

    //id前缀
    idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
    globalNum = 1,

    //最大的缓存步数
    comandRecordMaxLength = 10,

    //url中的不安全关键字
    urlUnsafeKeywords = ['<', '>', '(', ')'],

    //全局的构造函数
	$E = function($textarea, options){
        return new $E.fn.init($textarea, options);
    };
//prototype简写为fn
$E.fn = $E.prototype;
$.extend($E, {

    //console.log提示
    'consoleLog': function(info){
        if(window.console && window.console.log && typeof window.console.log === 'function'){
            window.console.log('wangEditor提示：', info);
        }
    },

    //获取唯一的id
    'getUniqeId': function(){
        return idPrefix + (globalNum++); 
    },

    //专门针对url的xss验证
    'filterXSSForUrl': function(url){
        var result = true;
        // if(url.indexOf("javascript:") >= 0){
        //     return false;
        // }
        $.each(urlUnsafeKeywords, function(key, val){
            if(url.indexOf(val) >= 0){
                result = false;
            }
        });
        return result;
    },

    //替换html中的单引号（&#39;）、双引号(&quot;)
    'replaceQuotes': function(html){
        if(html === ''){
            return html;
        }

        //去掉换行
        var result = html.replace(/\n/mg, "");

        //过滤单引号，双引号
        result = result.replace( /(<.*?>)|(')|(")/mg, function(a,b,c,d){ 
            if( b ){
                return b;
            }else if(c){
                return "&#39;";
            }else if(d){
                return "&quot;";
            }
        });

        return result;
    },
    
    //将table的边框强制显示
    'showTableBorder': function($content){
        $content.find('table').each(function(){
            var $this = $(this),
                mark = 'wangEditor_table_border_mark',
                markValue = $this.attr(mark);
            if(!markValue){
                //没有做标记的进来设置
                $this.attr('border', "1");
                $this.attr('bordercolor', "#cccccc");
                $this.attr('cellpadding', '0');
                $this.attr('cellspacing', '0');
                $this.css({
                    'border-collapse': 'collapse'
                    
                });
                $this.find('tr').first().find('td').css({
                    'min-width': '100px'
                });

                //做一个标记
                $this.attr(mark, '1');
            }
        });
    }
});
$.extend($E, {

    //样式配置
    'styleConfig': {
        'fontFamilyOptions': [
            '宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 
            'Arial', 'Verdana', 'Georgia', 'Times New Roman', 
            'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'
        ],
        'colorOptions': {
            '#880000': '暗红色',
            '#800080': '紫色',
            '#ff0000': '红色',
            '#ff00ff': '鲜粉色',
            '#000080': '深蓝色',
            '#0000ff': '蓝色',
            '#00ffff': '湖蓝色',
            '#008080': '蓝绿色',
            '#008000': '绿色',
            '#808000': '橄榄色',
            '#00ff00': '浅绿色',
            '#ffcc00': '橙黄色',
            '#808080': '灰色',
            '#c0c0c0': '银色',
            '#000000': '黑色',
            '#ffffff': '白色'
        },
        'fontsizeOptions': {
            1: '10px',
            2: '13px',
            3: '16px',
            4: '19px',
            5: '22px',
            6: '25px',
            7: '28px'
        },
        'blockQuoteStyle': 'display:block; border-left: 5px solid #d0e5f2; padding:0 0 0 10px; margin:0; line-height:1.4; font-size: 100%;'
    },

    //html模板
    'htmlTemplates': {
        //删除table,img的按钮
        'elemDeleteBtn': '<a href="#" class="wangEditor-elemDeleteBtn"><i class="icon-wangEditor-cancel"></i></a>',
        'imgResizeBtn': '<div class="wangEditor-imgResize"></div>',

        //整个编辑器的容器
        'editorContainer': '<div class="wangEditor-container"></div>',
        //菜单容器（加上clearfix）
        'btnContainer': '<div class="wangEditor-btn-container clearfix"></div>',
        //菜单组
        'btnContainerGroup': '<div class="wangEditor-btn-container-group"></div>',
        //单个菜单按钮（一定要有 herf='#'，否则无法监听blur事件）
        'btn': '<a class="wangEditor-btn-container-btn wangEditor-btn-container-btn-default" href="#"></a>', 
        //下拉按钮右侧的小三角
        'btnAngleDown': '<i class="icon-wangEditor-angle-down" style="margin-left:3px;"></i>',
        //btn tooltip
        'tooltip': '<div class="wangEditor-toolTip"></div>',
        //btn tooltipContent
        'tooltipContent': '<div class="wangEditor-toolTip-content">{title}</div>',
        //所有弹出框modal的容器
        'modalContainer': '<div class="wangEditor-modal-container"></div>',
        //modal（按大小分为4种）
        'modal': '<div class="wangEditor-modal">{content}</div>',
        'modalBig': '<div class="wangEditor-modal wangEditor-modal-big">{content}</div>',
        'modalSmall': '<div class="wangEditor-modal wangEditor-modal-small">{content}</div>',
        'modalMini': '<div class="wangEditor-modal wangEditor-modal-mini">{content}</div>',
        //modal header
        'modalHeader': '<div class="wangEditor-modal-header clearfix">' + 
                            '<a href="#" commandName="close" class="wangEditor-modal-header-close"><i class="icon-wangEditor-cancel"></i></a>' + 
                            '<b>{title}</b>' + 
                            '<div class="wangEditor-modal-header-line"></div>' + 
                        '</div>',
        //编辑框的容器
        'txtContainer': '<div class="wangEditor-textarea-container"></div>',
        //编辑框
        'txt': '<div class="wangEditor-textarea" contenteditable="true"><p><br/></p></div>',
        //dropmenu
        'dropMenu': '<ul class="wangEditor-drop-menu">{content}</ul>',
        //dropPanel
        'dropPanel': '<ul class="wangEditor-drop-panel">{content}</ul>',
        //dropPanel-big
        'dropPanelBig': '<ul class="wangEditor-drop-panel wangEditor-drop-panel-big">{content}</ul>',
        //dropPanel-floatItem
        'dropPanel_floatItem': '<div class="wangEditor-drop-panel-floatItem">{content}</div>',
        //视频
        'videoEmbed': '<embed src="{src}" allowFullScreen="true" quality="high" width="{width}" height="{height}" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>',
        //代码块
        'codePre': '<pre style="border:1px solid #ccc; background-color: #f5f5f5; padding: 10px; margin: 5px 0px; line-height: 1.4; font-size: 0.8em; font-family: Menlo, Monaco, Consolas; border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;"><code>{content}</code></pre><p><br></p>',
        //代码块（highlight插件）
        'codePreWidthHightLight': '<pre><code class="{lang}">{content}</code></pre>'
    },
    
    //表情配置（1.gif, 2.gif, 3.gif ... 100.gif）
    'expressionConfig': {
        'path':'http://www.wangeditor.com/expressions/',
        'fileNames':[1,100],
        'ext':'.gif'
    }
});
$.extend($E, {
	'getUploadImgComponentForCrossDomain': function(editor){
		var uploadUrl = editor.uploadUrl,
	        fileInputName = 'wangEditor_uploadImg',  //服务器端根据这个name获取file
	        imgExts = '|.bmp|.jpg|.jpeg|.png|.gif|',  //图片文件的后缀名（注意：前后都要加“|”）

	        formId = $E.getUniqeId(),
	        fileId = $E.getUniqeId(),
	        titleTxtId = $E.getUniqeId(),
	        btnId = $E.getUniqeId(),
	        infoId = $E.getUniqeId(),
	        iframeId = $E.getUniqeId(),
	        content =   '<form id="' + formId + '" method="post" enctype="multipart/form-data" target="' + iframeId + '">'+
	                    '   <p>选择文件：<input type="file" name="' + fileInputName + '" id="' + fileId + '"/></p>' +
	                    '   <p>图片标题：<input type="text" id="' + titleTxtId + '" style="width:250px;"/></p>' +
	                    '   <p><button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">上传</button></p>' +
	                    '   <span stype="color:red;" id="' + infoId + '"></span>' +
	                    '</form>' +
	                    '<div style="display:none;"><iframe id="' + iframeId + '" name="' + iframeId + '" style="display:none; width:0; height:0;"></iframe></div>',
	        $uploadImg_modal = $( content );
	    
	    $uploadImg_modal.find('#' + btnId).click(function(e){
	        //检验是否传入uploadUrl配置
	        if(uploadUrl == null || typeof uploadUrl !== 'string'){
	            alert('未配置URL地址，不能上传图片');
	            return;
	        }

	        //检验是否选择文件
	        var fileVal = $('#' + fileId).val();
	        if(fileVal === ''){
	            alert('请选择图片文件');
	            return;
	        }

	        //检验后缀名是否是图片
	        var ext = fileVal.slice( fileVal.lastIndexOf('.') - fileVal.length );
	        ext = '|' + ext.toLowerCase() + '|';
	        if(imgExts.indexOf(ext) === -1){
	            alert('选择的文件不是图片格式');
	            return;
	        }
	        
	        //检验通过，开始提交...

	        var $btn = $(this),
	            $info = $('#' + infoId),
	            $form = $('#' + formId),
	            title = $('#' + titleTxtId).val(),
	            iframe = document.getElementById(iframeId),
	            uploadImg_callback = function(){
	                //uploadImg callback
	                $('#' + fileId).val('');
	                $('#' + titleTxtId).val('');
	            };

	        //定义callback事件
	        window.wangEditor_uploadImgCallback = function(result){
	            //提示已经开始调用
	            $E.consoleLog('父页面的wangEditor_uploadImgCallback方法已经开始被调用！');

	            var arr,
	                url,  //真实图片url
	                thumbnailUrl;  //缩略图url，有可能不用缩略图
	            if(result.indexOf('ok|') === 0){
	                //成功
	                arr = result.split('|');

	                //获取图片url
	                url = arr[1];
	                $E.consoleLog('wangEditor_uploadImgCallback方法成功获取到图片url：' + url);

	                if(arr.length === 2){
	                    //无缩略图形式
	                    if(title === ''){
	                        editor.command(e, 'insertImage', url, uploadImg_callback);
	                    }else{
	                        editor.command(e, 'customeInsertImage', {'url':url, 'title':title}, uploadImg_callback);
	                    }
	                }else if(arr.length === 3){
	                    //有缩略图形式
	                    thumbnailUrl = arr[2];
	                    $E.consoleLog('wangEditor_uploadImgCallback方法成功获取到缩略图url：' + thumbnailUrl);

	                    //执行插入图片（显示缩略图，链接到真实图片）
	                    editor.command(e, 'customeInsertImage', {'url':thumbnailUrl, 'link': url, 'title':title}, uploadImg_callback);
	                }else{
	                    alert('hash格式错误：' + result);
	                    return;
	                }

	                //提示成功插入图片
	                $E.consoleLog('wangEditor_uploadImgCallback方法已经成功插入图片，弹出框也被关闭！');
	                
	            }else{
	                //失败
	                alert(result);
	            }

	            //用完立刻清除，防止影响其他editor
	            window.wangEditor_uploadImgCallback = undefined;
	        };

	        //先暂时禁用按钮
	        $btn.hide();
	        $info.html('上传中...');

	        try{
	            //设置uploadUrl，提交form
	            $form.attr('action', uploadUrl);
	            $form.submit();
	        }catch(ex){
	            alert(ex.name + ':' + ex.message);
	        }finally{
	            //恢复按钮状态
	            $btn.show();
	            $info.html('');
	            e.preventDefault();
	        }

	        return false;
	    });

	    return $uploadImg_modal;
	}
});
$.extend($E, {

	//检测命令是否支持
    'commandEnabled': function(commandName){
        var enabled;
        try{
            enabled = document.queryCommandEnabled(commandName);
        }catch(ex){
            enabled = false;
        }
        return enabled;
    },

    //获取可以插入表格的元素，用于 commandHooks['insertHTML']
    'getElemForInsertTable': function($elem){
        if ($elem[0].nodeName.toLowerCase() === 'body') {
            return;
        }
        if ($elem.parent().is('div[contenteditable="true"]')) {
            return $elem;
        }
        if ($elem.is('div[contenteditable="true"]')) {
            if($elem.children().length === 0){
                $elem.append( $('<p></p>') );
            }
            return $elem.children().last();
        } else {
            return this.getElemForInsertTable($elem.parent());
        }
    }
});
$.extend($E, {

    //创建一个菜单组
    'createMenuGroup': function(menuGroup, editor){
        if(menuGroup instanceof Array === false){
            return;
        }
        var $group = $( $E.htmlTemplates.btnContainerGroup );
        $.each(menuGroup, function(key, menuId){
            //遍历这个菜单组，创建每一个菜单
            var btn = $E.createMenu(menuId, editor);
            if(btn instanceof Array){
                $.each(btn, function(key, value){
                    $group.append(value);
                });
            }else{
                $group.append(btn);
            }
        });
        //插入这个菜单组
        editor.insertMenuGroup($group);
    },
    
    //创建一个菜单
    'createMenu': function(menu, editor){
        //验证
        if(menu == null){
            return;
        }
        menu = $.trim( menu.toString() );
        menu = editor.menus[menu];
        if(!menu){
            return;
        }

        var title = menu.title,
            type = menu.type,
            cssClass = menu.cssClass,
            txt,
            style = menu.style,
            command = menu.command,  //函数或者字符串
            commandValue = menu.commandValue, //字符串或者undefined
            hotKey = menu.hotKey, //快捷键
            fnKeys = [],
            keyCode,
            beforeFn = menu.beforeFn,  //在menus配置文件中定义的，点击按钮之前的事件
            $dropMenu = menu.dropMenu && menu.dropMenu(),
            $dropPanel = menu.dropPanel && menu.dropPanel(editor),
            $modal = menu.modal && menu.modal(editor),
            callback = menu.callback,
            $btn = $( $E.htmlTemplates.btn ),  
            resultArray = [$btn],

            //将在下文定义的函数
            btnClick,
            isFnKeys,
            hideDropMenu,
            hideDropPanel,
            showToolTip;

        if(typeof command === 'string'){
            command = $.trim(command);
        }

        //btn txt
        if(style){
            txt = '<i class="' + cssClass + '" style="' + style + '"></i>';
        }else{
            txt = '<i class="' + cssClass + '"></i>';
        }
        $btn.html(txt);

        //btn title
        if(title){
            $btn.attr('title', title);
        }

        //普通按钮
        if(type === 'btn'){
            //记录commandName
            if(typeof command === 'string'){
                $btn.attr('commandName', command);
            }

            //基本命令（command是字符串）
            if(typeof command === 'string'){
                btnClick = function(e){
                    editor.hideModal();   //先视图隐藏目前显示的modal
                    //执行操作
                    editor.command(e, command, commandValue, callback);

                    e.stopPropagation();  //最后阻止冒泡
                };
            }
            //自定义命令（command是函数）
            if(typeof command === 'function'){
                btnClick = function(e){
                    editor.hideModal();   //先视图隐藏目前显示的modal
                    
                    command(e);  //如果command是函数，则直接执行command
                    
                    e.stopPropagation();  //最后阻止冒泡
                };
            }
            if(hotKey){
                //快捷键
                hotKey = hotKey.toLowerCase();
                keyCode = $.trim( hotKey.split('+')[1] );
                fnKeys = hotKey.split('+')[0].split(',');
                $.each(fnKeys, function(key, value){
                    fnKeys[key] = $.trim(value);
                });
                isFnKeys = function(e){
                    //判断功能键，暂时支持 ['ctrl', 'shift', 'alt', 'meta']
                    var flag = true;
                    $.each(['ctrl', 'shift', 'alt', 'meta'], function(key, value){
                        if(fnKeys.indexOf(value) !== -1 && !e[value + 'Key']){
                            flag = false;
                        }else if(fnKeys.indexOf(value) === -1 && e[value + 'Key']){
                            flag = false;
                        }
                    });
                    return flag;
                };
                editor.bindEventFor$txt('keydown', function(e){
                    if(isFnKeys(e) === false){
                        return;
                    }
                    if( String.fromCharCode(e.keyCode).toLowerCase() === keyCode ){
                        e.preventDefault();
                        $btn.click();  //通过模拟按钮点击的方式触发
                    }
                });
            }
        }
        //下拉菜单
        else if(type === 'dropMenu'){
            $btn.append($( $E.htmlTemplates.btnAngleDown ));  //btn后面的下拉箭头

            //渲染下拉菜单
            resultArray.unshift($dropMenu);

            hideDropMenu = function(){
                $dropMenu.hide();
            };
            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                $dropMenu.css('display', 'inline-block');
                e.preventDefault();
                $btn.focus();  //for 360急速浏览器
                
                e.stopPropagation();  //最后阻止冒泡
            };
            $btn.blur(function(e){
                setTimeout(hideDropMenu, 200);  //待执行完命令（等待200ms），再隐藏
            });

            //命令（使用事件代理）
            $dropMenu.on('click', 'a[commandValue], a[customCommandName]', function(e){
                var $this = $(this),
                    value = $this.attr('commandValue'),
                    commandName = $this.attr('customCommandName');

                //下拉菜单类型中，有些可能每个菜单的commandName不同，例如列表、对齐方式
                if(commandName){
                    command = commandName;
                }
                
                editor.command(e, command, value, callback);
            });

            hideDropMenu();  //刚加载时先隐藏起来
        }
        //下拉面板
        else if(type === 'dropPanel'){
            //渲染下拉面板
            resultArray.unshift($dropPanel);

            hideDropPanel = function(){
                $dropPanel.hide();
            };
            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                $dropPanel.css('display', 'inline-block');
                e.preventDefault();
                $btn.focus();  //for 360急速浏览器
                
                e.stopPropagation();  //最后阻止冒泡
            };
            $btn.blur(function(e){
                setTimeout(hideDropPanel, 200);  //待执行完命令，再隐藏
            });

            //命令（使用事件代理）
            $dropPanel.on('click', 'a[commandValue]', function(e){
                var $this = $(this),
                    value = $this.attr('commandValue');
                
                editor.command(e, command, value, callback);
            });

            hideDropPanel();  //刚加载时先隐藏起来
        }
        //弹出框
        else if(type === 'modal'){
            //$modal 头部信息
            $modal.prepend($(
                $E.htmlTemplates.modalHeader.replace('{title}', title)
            ));

            //插入编辑器
            editor.insertModal($modal);

            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                //计算margin-left;
                //editor.$editorContainer的position时relative，因此要根据它来计算
                $modal.css('margin-left', (editor.$editorContainer.outerWidth()/2 - $modal.outerWidth()/2));

                $modal.show();
                e.preventDefault();

                e.stopPropagation();  //最后阻止冒泡
            };
            $modal.find('[commandName=close]').click(function(e){
                $modal.hide();
                e.preventDefault();
            });
        }

        //绑定按钮点击事件
        $btn.click(function(e){
            if(beforeFn && typeof beforeFn === 'function'){
                beforeFn(editor);
            }
            if(btnClick && typeof btnClick === 'function'){
                btnClick(e);
            }
        });

        //按钮 tooltip 效果
        if(title){
            $btn.attr('title', '');
            if(hotKey){
                title = title + '('  + hotKey + ')';  //加入快捷键提示
            }

            var $toolTip = $( $E.htmlTemplates.tooltip ),
                $toolTipContent = $( $E.htmlTemplates.tooltipContent.replace('{title}', title) ),
                timer,
                margin_left;

            $toolTip.append($toolTipContent);
            resultArray.unshift($toolTip);

            showToolTip = function(){
                $toolTip.css('display', 'inline-block');
            };
            $btn.mouseenter(function(){
                //计算$tooltip的margin-left，只计算一次
                if(!margin_left){
                    margin_left = $toolTip.css('margin-left');
                }
                if(margin_left === '0px'){
                    margin_left = ( 0 - ($toolTip.outerWidth()/2 - $btn.outerWidth()/2) ) + 'px';
                    $toolTip.css('margin-left', margin_left);
                }

                timer = setTimeout(showToolTip, 200);  //0.2s之后才显示tooltip，防止鼠标快速经过时会闪烁
            }).mouseleave(function(){
                clearTimeout(timer);
                $toolTip.hide();
            });
        }

        //返回菜单
        return resultArray;
    }
});
$.extend($E.fn, {

	//初始化函数
    'init': function($textarea, options){
        /*
        * options: {
        *   menuConfig: [...],   //配置要显示的菜单（menuConfig会覆盖掉hideMenuConfig）
        *   onchange: function(){...},  //配置onchange事件，
        *   expressions: [...],  //配置表情图片的url地址
        *   uploadImgComponent : $('#someId'),  //上传图片的组件
        *   uploadUrl: 'string'  //图片上传的地址
        * }
        */

        var //options
            onchange = options.onchange,
            menuConfig = options.menuConfig,
            expressions = options.expressions,
            uploadImgComponent = options.uploadImgComponent,
            uploadUrl = options.uploadUrl,

            //editor
            editor = this,
            height = $textarea.height(),
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

            editor.$txtContainer.height( txtContainerHeight );
            //editor.$txt.css('min-height', height + 'px');
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
$.extend($E.fn, {
	//初始化指定元素左上角的删除按钮
    'initDeleteBtn': function(selectExpression){
        var editor = this,
            $deleteBtn = editor.$elemDeleteBtn,
            focusIdNow;  //当前focus元素的id——$elem.data('deleteBtnId')

        //隐藏删除按钮
        function hideElemDeleteBtn(){
            //隐藏按钮
            var deleteBtnDisplay = $deleteBtn.css('display');
            if( deleteBtnDisplay !== '' && deleteBtnDisplay !== 'none' ){
                $deleteBtn.hide();
            }
            //清空 focusIdNow
            focusIdNow = '';
        }

        //为目标元素（如img、table）绑定click事件
        editor.$txt.on('click', selectExpression, function(e){
            var $elem = $(this),
                elemDeleteBtnId = $elem.data('deleteBtnId'),
                uniqueId = $E.getUniqeId();

            if(elemDeleteBtnId && focusIdNow === elemDeleteBtnId){
                e.stopPropagation(); //阻止冒泡，不能让 editor.$txt 监控到click事件
                return; //如果当前元素已经被focus，删除按钮此时已经显示了，则无需再重新显示删除按钮
            }else{
                //如果当前元素没有被focus，则把focusIdNow赋值成该元素的Id
                if(!elemDeleteBtnId){
                    $elem.data('deleteBtnId', uniqueId);
                    elemDeleteBtnId = uniqueId;
                }
                focusIdNow = elemDeleteBtnId;
            }

            var btnContainerTop = editor.$btnContainer.position().top,
                btnContainerHeight = editor.$btnContainer.outerHeight(),
                elemPostion = $elem.position(),
                elemTop = elemPostion.top,
                elemLeft = elemPostion.left,
                btnWidth = $deleteBtn.width(),
                btnHeight = $deleteBtn.height();
            if(elemTop <= btnContainerTop + btnContainerHeight){
                //说明此时$elem的上不，已经被$btnContainer覆盖了
                return;
            }
            $deleteBtn.css({
                'top': (elemTop - btnHeight/2) + 'px',
                'left': (elemLeft - btnWidth/2) + 'px'
            });
            $deleteBtn.show();

            //滚动时隐藏
            editor.$txtContainer.off('scroll.deleteBtn');
            editor.$txtContainer.on('scroll.deleteBtn', hideElemDeleteBtn);

            //点击btn，删除
            $deleteBtn.off();
            $deleteBtn.click(function(e){
                //统一用editor.command删除，方便撤销
                editor.command(e, 'delete$elem', $elem, hideElemDeleteBtn);  
            });

            //阻止冒泡，不能让 editor.$txt 监控到click事件
            e.stopPropagation(); 
            e.preventDefault();
        });
        //隐藏删除按钮
        editor.$txt.on('click keyup blur', function(e){
            if(e.type === 'blur'){
                setTimeout(hideElemDeleteBtn, 100); //预留0.1毫秒，等待 $deleteBtn.click 执行
            }else{
                hideElemDeleteBtn();
            }
        });
    }
});
$.extend($E.fn, {
	//初始化img右下角的resize按钮
    'initImgResizeBtn': function(selectExpression){
        var editor = this,
            $resizeBtn = editor.$imgResizeBtn,
            focusIdNow,  //当前focus元素的id——$elem.data('imgResizeId')
            isResizeBtnMoving = false;  //是否正在移动？

        //隐藏rezie按钮
        function hideResizeBtn(){
            if(isResizeBtnMoving){
                return;
            }

            //隐藏按钮
            var resizeBtnDisplay = $resizeBtn.css('display');
            if( resizeBtnDisplay !== '' && resizeBtnDisplay !== 'none' ){
                $resizeBtn.hide();
            }
            //清空 focusIdNow
            focusIdNow = '';
        }

        //绑定img的click事件（显示resize按钮）
        editor.$txt.on('click', selectExpression, function(e){
            var $elem = $(this),
                elemId = $elem.data('imgResizeId'),
                uniqueId = $E.getUniqeId();

            if(elemId && focusIdNow === elemId){
                e.stopPropagation(); //阻止冒泡，不能让 editor.$txt 监控到click事件
                return; //如果当前元素已经被focus，resize按钮此时已经显示了，则无需再重新显示resize按钮
            }else{
                //如果当前元素没有被focus，则把focusIdNow赋值成该元素的Id
                if(!elemId){
                    $elem.data('imgResizeId', uniqueId);
                    elemId = uniqueId;
                }
                focusIdNow = elemId;
            }

            var elemPosition = $elem.position(),
                elemTop = elemPosition.top,
                elemLeft = elemPosition.left,
                elemWidth = $elem.outerWidth(),
                elemHeight = $elem.outerHeight(),

                txtContainerPosition = editor.$txtContainer.position(),
                txtContainerTop = txtContainerPosition.top,
                txtContainerLeft = txtContainerPosition.left,
                txtContainerWidth = editor.$txtContainer.outerWidth(),
                txtContainerHeight = editor.$txtContainer.outerHeight(),

                btnWidth = $resizeBtn.outerWidth(),
                btnHeight = $resizeBtn.outerHeight(),

                //$resizebtn 拖拽相关的变量
                editorContainerPostion = editor.$editorContainer.position(),
                editorContainerLeft = editorContainerPostion.left,
                editorContainerTop = editorContainerPostion.top,
                resizeBtnWidth,
                resizeBtnHeight,
                _x,
                _y;

            if(elemTop + elemHeight > txtContainerTop + txtContainerHeight){
                //元素底部已经被txtContainer覆盖
                return;
            }
            if(elemLeft + elemWidth > txtContainerLeft + txtContainerWidth){
                //元素右边已经被txtContainer覆盖
                return;
            }

            //定位resizeBtn，并显示出来
            $resizeBtn.css({
                'top': (elemTop + elemHeight - btnHeight) + 'px',
                'left': (elemLeft + elemWidth - btnWidth) + 'px'
            });
            $resizeBtn.show();

            //滚动时隐藏
            editor.$txtContainer.off('scroll.resizebtn');
            editor.$txtContainer.on('scroll.resizebtn', hideResizeBtn);

            //设置resizebtn事件
            $resizeBtn.off();
            $resizeBtn.on('mousedown', function(e){
                //开始移动的标记
                isResizeBtnMoving = true;

                //计算鼠标离 resizeBtn 左上角的相对位置 
                var resizeBtnPostion = $resizeBtn.position();
                _x = e.pageX - editorContainerLeft - resizeBtnPostion.left;
                _y = e.pageY - editorContainerTop - resizeBtnPostion.top;

                //记录 $resizeBtn 的长度宽度
                resizeBtnWidth = $resizeBtn.outerWidth();
                resizeBtnHeight = $resizeBtn.outerHeight();
            });
            $document.off('mousemove.resizeBtn mouseup.resizeBtn');
            $document.on('mousemove.resizeBtn', function(e){
                if(isResizeBtnMoving){
                    //计算，鼠标离 editorContainer 左上角的相对位置
                    var x = e.pageX - editorContainerLeft - _x,
                        y = e.pageY - editorContainerTop - _y;
                    $resizeBtn.css({
                        'top': y,
                        'left': x
                    });

                    //获取 $resizeBtn 最新的位置
                    var resizeBtnPostion = $resizeBtn.position(),
                        resizeBtnLeft = resizeBtnPostion.left,
                        resizeBtnTop = resizeBtnPostion.top;
                    $elem.css({
                        'width': resizeBtnLeft + resizeBtnWidth - elemLeft,
                        'height': resizeBtnTop + resizeBtnHeight - elemTop
                    });

                    e.preventDefault();
                }
            }).on('mouseup.resizeBtn', function(e){
                //移动结束的标记
                isResizeBtnMoving = false;
            });

            //阻止冒泡，不能让 editor.$txt 监控到click事件
            e.stopPropagation();  
            e.preventDefault();
        });
        //隐藏resizeBtn按钮
        editor.$txt.on('click keyup blur', function(e){
            if(e.type === 'blur'){
                setTimeout(hideResizeBtn, 100); //预留0.1毫秒，等待 $resizeBtn.mousedown 执行
            }else{
                hideResizeBtn();
            }
        });
    }
});
//重点！！！
//构造函数是$E.fn.init，将构造函数的prototype指向$E.fn
//模仿jquery写法
$E.fn.init.prototype = $E.fn;

/*
注意：该文档为合并文档，由“11-fn-menus”文件夹中的多个文件合并而成
*/

$.extend($E.fn, {
	'initMenus': function(){
		//菜单配置集
        /*
            menus = {
                'menuId-1': {
                    'title': （字符串，必须）标题,
                    'type':（字符串，必须）类型，可以是 btn / dropMenu / dropPanel / modal,
                    'cssClass': （字符串，必须）fontAwesome字体样式，例如 'fa fa-head',
                    'style': （字符串，可选）设置btn的样式
                    'hotKey':（字符串，可选）快捷键，如'ctrl + b', 'ctrl,shift + i', 'alt,meta + y'等，支持 ctrl, shift, alt, meta 四个功能键（只有type===btn才有效）,
                    'beforeFn': (函数，可选) 点击按钮之后立即出发的事件
                    'command':（字符串）document.execCommand的命令名，如'fontName'；也可以是自定义的命令名，如“撤销”、“插入表格”按钮（type===modal时，command无效）,
                    'commandValue': (字符串) document.execCommand的命令值，如 'blockQuote'，可选
                    'dropMenu': （$ul，可选）type===dropMenu时，要返回一个$ul，作为下拉菜单,
                    'modal':（$div，可选）type===modal是，要返回一个$div，作为弹出框,
                    'callback':（函数，可选）回调函数,
                },
                'modaId-2':{
                    ……
                }
            }
        */
        this.menus = {
'bold': {
    'title': '加粗',
    'type': 'btn',
    'hotKey': 'ctrl + b',
    'beforeFn': function(editor){
        //alert('点击按钮之后立即出发的事件，此时还未触发command');
        //console.log(editor);
    },
    'cssClass':'icon-wangEditor-bold',
    'command': 'bold',
    'callback': function(editor){
        //console.log(editor);
    }
},
'underline': {
    'title': '下划线',
    'type': 'btn',
    'hotKey': 'ctrl + u',
    'cssClass':'icon-wangEditor-underline',
    'command': 'underline '
},
'italic': {
    'title': '斜体',
    'type': 'btn',
    'hotKey': 'ctrl + i',
    'cssClass':'icon-wangEditor-italic',
    'command': 'italic '
},
'removeFormat': {
    'title': '清除格式',
    'type': 'btn',
    'cssClass':'icon-wangEditor-eraser',
    'command': 'RemoveFormat ' 
},
// 'indent': {
//     'title': '增加缩进',
//     'type': 'btn',
//     'hotKey': 'ctrl,shift + i',
//     'cssClass':'icon-wangEditor-indent-right',
//     'command': 'indent'
// },
// 'outdent': {
//     'title': '减少缩进',
//     'type': 'btn',
//     'cssClass':'icon-wangEditor-indent-left',
//     'command': 'outdent'
// }, 
'unLink': {
    'title': '取消链接',
    'type': 'btn',
    'cssClass':'icon-wangEditor-unlink',
    'command': 'unLink ' 
},
'insertHr': {
    'title': '插入横线',
    'type': 'btn',
    'cssClass':'icon-wangEditor-minus',
    'command': 'InsertHorizontalRule' 
},
'strikethrough':{
    'title': '删除线',
    'type': 'btn',
    'cssClass':'icon-wangEditor-strikethrough',
    'command': 'StrikeThrough'
},
'blockquote': {
    'title': '引用',
    'type': 'btn',
    'cssClass':'icon-wangEditor-quotes-left',
    'command': 'formatBlock',
    'commandValue': 'blockquote',
    'callback': function(editor){
        //获取所有的引用块
        var $blockquotes = editor.$txt.find('blockquote'),
            key = 'hadStyle';

        //遍历所有引用块，设置样式
        $.each($blockquotes, function(index, value){
            var $quote = $(value),
                data = $quote.data(key),  //获取 key 的值
                style;

            if(data){
                //如果通过 key 获取的有值，说明它已经有样式了
                //可以不再重复操作
                return;
            }

             //获取当前的 style ，或者初始化为空字符串
            style = $quote.attr('style') || '';
            
            //拼接新的 style
            style = $E.styleConfig.blockQuoteStyle + style;

            //重新赋值
            $quote.attr('style', style);

            //最后，做标记
            $quote.data(key, true);
        });
    }
},
'justify': {
    'title': '对齐',
    'type': 'dropMenu',
    'cssClass':'icon-wangEditor-align-left',
    'dropMenu': function(){
        var arr = [],
            temp = '<li><a href="#" customCommandName="${command}">${txt}</a></li>',
            $ul,

            data = [
                {
                    //左对齐
                    'commandName': 'JustifyLeft',
                    'txt': '<i class="icon-wangEditor-align-left"> 左对齐</i>'
                },{
                    //居中
                    'commandName': 'JustifyCenter',
                    'txt': '<i class="icon-wangEditor-align-center"> 居中</i>'
                },{
                    //右对齐
                    'commandName': 'JustifyRight',
                    'txt': '<i class="icon-wangEditor-align-right"> 右对齐</i>'
                }
            ];

        $.each(data, function(key, value){
            arr.push(
                temp.replace('${command}', value.commandName)
                    .replace('${txt}', value.txt)
            );
        });

        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    }
},
'list': {
    'title': '列表',
    'type': 'dropMenu',
    'cssClass':'icon-wangEditor-list-bullet',
    'dropMenu': function () {
        var arr = [],
            temp = '<li><a href="#" customCommandName="${command}">${txt}</a></li>',
            $ul,

            data = [
                {
                    //无序列表
                    'commandName': 'InsertUnorderedList',
                    'txt': '<i class="icon-wangEditor-list-bullet"> 无序列表</i>'
                },{
                    //有序列表
                    'commandName': 'InsertOrderedList',
                    'txt': '<i class="icon-wangEditor-list-numbered"> 有序列表</i>'
                }
            ];

        $.each(data, function(key, value){
            arr.push(
                temp.replace('${command}', value.commandName)
                    .replace('${txt}', value.txt)
            );
        });

        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    }
},
'fontFamily': {
    'title': '字体',
    'type': 'dropMenu',
    'cssClass': 'icon-wangEditor-font2',
    'command': 'fontName ', 
    'dropMenu': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<li><a href="#" commandValue="${value}" style="font-family:${family};">${txt}</a></li>',
            $ul;

        $.each($E.styleConfig.fontFamilyOptions, function(key, value){
            arr.push(
                temp.replace('${value}', value)
                    .replace('${family}', value)
                    .replace('${txt}', value)
            );
        });
        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    },
    'callback': function(editor){
        //console.log(editor);
    }
},
'fontSize': {
    'title': '字号',
    'type': 'dropMenu',
    'cssClass': 'icon-wangEditor-text-height',
    'command': 'fontSize',
    'dropMenu': function () {
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<li><a href="#" commandValue="${value}" style="font-size:${fontsize};">${txt}</a></li>',
            $ul;

        $.each($E.styleConfig.fontsizeOptions, function(key, value){
            arr.push(
                temp.replace('${value}', key)
                    .replace('${fontsize}', value)
                    .replace('${txt}', value)
            );
        });
        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    }
},
'setHead': {
    'title': '设置标题',
    'type': 'dropMenu', 
    'cssClass':'icon-wangEditor-header',
    'command': 'formatBlock ',
    'dropMenu': function(){ 
        var liListStr =  '<li><a href="#" commandValue="<h1>"><h1>标题1</h1></a></li>' + 
                    '<li><a href="#" commandValue="<h2>"><h2>标题2</h2></a></li>' + 
                    '<li><a href="#" commandValue="<h3>"><h3>标题3</h3></a></li>' + 
                    '<li><a href="#" commandValue="<h4>"><h4>标题4</h4></a></li>' + 
                    '<li><a href="#" commandValue="<p>">正文</a></li>';
        return $( $E.htmlTemplates.dropMenu.replace('{content}', liListStr) );
    }
},
'foreColor': {
    'title': '字体颜色',
    'type': 'dropPanel',
    'cssClass': 'icon-wangEditor-pencil', 
    //'style': 'color:blue;',
    'command': 'foreColor',
    'dropPanel': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<a href="#" commandValue="${value}" style="background-color:${color};" title="${txt}" class="forColorItem">&nbsp;</a>',
            $panel;

        $.each($E.styleConfig.colorOptions, function(key, value){
            var floatItem = temp.replace('${value}', key)
                                .replace('${color}', key)
                                .replace('${txt}', value);
            arr.push(
                $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
            );
        });
        $panel = $( 
            $E.htmlTemplates.dropPanel.replace('{content}', arr.join('')) 
        );
        return $panel; 
    }
},
'backgroundColor': {
    'title': '背景色',
    'type': 'dropPanel',
    'cssClass': 'icon-wangEditor-brush',  
    //'style':'color:red;',
    'command': 'backColor ',
    'dropPanel': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<a href="#" commandValue="${value}" style="background-color:${color};" title="${txt}" class="forColorItem">&nbsp;</a>',
            $panel;

        $.each($E.styleConfig.colorOptions, function(key, value){
            var floatItem =  temp.replace('${value}', key)
                                .replace('${color}', key)
                                .replace('${txt}', value);
            arr.push(
               $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
            );
        });
        $panel = $( 
            $E.htmlTemplates.dropPanel.replace('{content}', arr.join('')) 
        );
        return $panel; 
    }
},
'createLink': {
    'title': '插入链接',
    'type': 'modal', 
    'cssClass': 'icon-wangEditor-link',
    'modal': function (editor) {
        var urlTxtId = $E.getUniqeId(),
            titleTxtId = $E.getUniqeId(),
            blankCheckId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content = '<p>链接：<input id="' + urlTxtId + '" type="text" style="width:300px;"  placeholder="http://"/></p>' +
                        '<p>标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/></p>' + 
                        '<p>新窗口：<input id="' + blankCheckId + '" type="checkbox" checked="checked"/></p>' +
                        '<p><button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入链接</button></p>',
            $link_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );
        $link_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $link_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var url = $.trim($('#' + urlTxtId).val()),
                title = $.trim($('#' + titleTxtId).val()),
                isBlank = $('#' + blankCheckId).is(':checked'),
                link_callback = function(){
                    //create link callback
                    $('#' + urlTxtId).val('');
                    $('#' + titleTxtId).val('');
                };

            if(url !== ''){
                //xss过滤
                if($E.filterXSSForUrl(url) === false){
                    alert('您的输入内容有不安全字符，请重新输入！');
                    return;
                }
                if(title === '' && !isBlank){
                    editor.command(e, 'createLink', url, link_callback);
                }else{
                    editor.command(e, 'customCreateLink', {'url':url, 'title':title, 'isBlank':isBlank}, link_callback);
                }
            }
        });

        return $link_modal;
    }
},
'insertExpression': {
    'title': '插入表情',
    'type': 'dropPanel',
    'command': 'insertImage',
    'cssClass': 'icon-wangEditor-happy',
    'dropPanel': function(editor){
        //生成表情配置列表
        var config = $E.expressionConfig,
            path = config.path,
            fileNames = config.fileNames,  // [1,100]
            firstName = fileNames[0],  // 1
            lastName = fileNames[1],  // 100
            ext = config.ext,  //.gif
            expressionArr = [],
            i = 1;

        if(editor.expressions){
            //自定义配置的表情图片配置
            expressionArr = editor.expressions;
        }else{
            //默认的表情图片配置
            for(; i<=lastName; i++){
                expressionArr.push( path + i + ext );
            }
        }

        //生成dropPanel
        var arr = [],
            temp = 
                '<a href="#" commandValue="${value}">' +   //注意，此处commandValue必填项，否则程序不会跟踪
                '   <img src="${src}" expression="1"/>' + 
                '</a>',
            $panel;

        $.each(expressionArr, function(key, value){
            var floatItem = temp.replace('${value}', value)
                                .replace('${src}', value);
            arr.push(
                $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
            );
        });
        $panel = $( 
            $E.htmlTemplates.dropPanelBig.replace('{content}', arr.join('')) 
        );
        return $panel; 
    }
},
'insertVideo': {
    'title': '插入视频',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-play',
    'modal': function(editor){
        var txtSrcId = $E.getUniqeId(),
            txtWidthId = $E.getUniqeId(),
            txtHeightId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            defaultWidth = 480, defaultHeight = 400;
        var content = '<p>地址：<input id="' + txtSrcId + '" type="text" style="width:300px;"  placeholder="http://"/></p>' +
                        '<p>宽度：<input id="' + txtWidthId + '" type="text" style="width:50px" value="' + defaultWidth + '"/> px（像素）</p>' +
                        '<p>高度：<input id="' + txtHeightId + '" type="text" style="width:50px" value="' + defaultHeight + '"/> px（像素） </p>' +
                        '<p><button id="' + btnId + '" class="wangEditor-modal-btn" type="button">插入视频</button></p>';
        var $video_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );

        //插入视频点击事件
        $video_modal.find('#' + btnId).click(function(e){
            var src = $.trim( $('#' + txtSrcId).val() ), 
                width = +( $('#' + txtWidthId).val() ),
                height = +( $('#' + txtHeightId).val() ),
                embed,
                video_callback = function(){
                    $('#' + txtSrcId).val('');
                    $('#' + txtWidthId).val(defaultWidth);
                    $('#' + txtHeightId).val(defaultHeight);
                };

            //验证src的合法性
            if($E.filterXSSForUrl(src) === false){
                alert('您的输入内容有不安全字符，请重新输入！');
                return;
            }

            //在此验证src
            if( (src.indexOf('http://') !== 0 && src.indexOf('https://') !== 0) || src.indexOf('.swf') === -1 ){
                alert('您输入的内容不符合要求');
                return;
            }

            //验证高度和宽度的合法性，不合法则使用默认配置
            if(isNaN(width)){
                width = defaultWidth;
            }
            if(isNaN(height)){
                height = defaultHeight;
            }

            embed = $E.htmlTemplates.videoEmbed
                    .replace('{src}', src)
                    .replace('{width}', width)
                    .replace('{height}', height);

            editor.command(e, 'insertHTML', embed, video_callback);
        });

        return $video_modal;
    }
},
'insertTable': {
    'title': '插入表格',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-table',
    'modal': function(editor){
        var rowNumTxtId = $E.getUniqeId(),
            colNumTxtId = $E.getUniqeId(),
            titleCheckId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content = '<p>行数：<input id="' + rowNumTxtId + '" type="text" value="3"/></p>' + 
                        '<p>列数：<input id="' + colNumTxtId + '" type="text" value="5"/></p>' +
                        '<p>显示首行背景：<input id="' + titleCheckId + '" type="checkbox" checked="checked"/></p>' + 
                        '<p><button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">插入表格</button></p>',
            $table_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );
        $table_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $table_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var rowNumValue = $('#' + rowNumTxtId).val(),
                rowNum = rowNumValue === '' || isNaN(+rowNumValue) ? 3 : rowNumValue,
                colNumValue = $('#' + colNumTxtId).val(),
                colNum = colNumValue === '' || isNaN(+colNumValue) ? 5 : colNumValue,
                firstRowBold = $('#' + titleCheckId).is(':checked'),

                table_callback = function(){
                    //inserttable callback
                    $('#' + rowNumTxtId).val('');
                    $('#' + colNumTxtId).val('');
                },

                i, j,
                //表格模板
                table = '',
                tableTemp = '<table border="1" bordercolor="#cccccc" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" > ${content} </table>',
                trArray = [],
                firstTrTemp = '<tr style="font-weight:bold;background-color:#f1f1f1;">${content}</tr>',
                trTemp = '<tr>${content}</tr>',
                tdArray,
                tdTemp_FirstRow = '<td style="min-width:100px; padding:5px;">&nbsp;</td>',
                tdTemp = '<td style="padding:5px;">&nbsp;</td>';
            
            for (i = 0; i < rowNum; i++) {
                //遍历每一行
                tdArray = [];
                for (j = 0; j < colNum; j++) {
                    //遍历本行的每一列
                    if(i === 0){
                        tdArray.push(tdTemp_FirstRow);  //第一行的td带宽度样式
                    }else{
                        tdArray.push(tdTemp);  //第二行往后的td不带宽度样式（没必要）
                    }
                }
                if (i === 0 && firstRowBold) {
                    trArray.push(firstTrTemp.replace('${content}', tdArray.join('')));
                } else {
                    trArray.push(trTemp.replace('${content}', tdArray.join('')));
                }
            }
            //生成table代码
            table = tableTemp.replace('${content}', trArray.join(''));

            //执行插入
            editor.command(e, 'insertHTML', table, table_callback);
        });
        return $table_modal;
    }
},
'insertImage': {
    'title': '图片',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-picture',
    'modal': function (editor) {
        var 
            //上传组件
            uploadImgComponent = editor.uploadImgComponent,

            webImgContainerId = $E.getUniqeId(),
            alertInfoId = $E.getUniqeId(),
            changeLinkId = $E.getUniqeId(),
            urlTxtId = $E.getUniqeId(),
            titleTxtId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content =   '<p>' +
                        '   <span id="' + alertInfoId + '">插入网络图片</span> ' +
                        '   <a href="#" id="' + changeLinkId + '"></a>' +
                        '</p>' +
                        '<div id="' + webImgContainerId + '">' +
                        '   <p>网址：<input id="' + urlTxtId + '" type="text" style="width:300px;" placeholder="http://"/></p>' +
                        '   <p>标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/></p>' +
                        '<p><button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入图片</button></p>' +
                        '</div>',
            $webimg_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );

        //处理 上传图片 和 插入网络图片 的显示与隐藏关系
        $(function(){
            var $webImgContainerId = $('#' + webImgContainerId),
                $alertInfoId = $('#' + alertInfoId),
                $changeLinkId = $('#' + changeLinkId);

            //显示本地上传，隐藏网路图片
            function showUploadImg(){
                uploadImgComponent.show();
                $webImgContainerId.hide();

                //修改提示内容
                $alertInfoId.text('上传本地图片');
                $changeLinkId.text('或插入网络图片');
            }

            //显示网络图片，隐藏本地上传
            function showWebImg(){
                uploadImgComponent.hide();
                $webImgContainerId.show();

                //修改提示内容
                $alertInfoId.text('插入网络图片');
                $changeLinkId.text('或上传本地图片');
            }
 
            if(uploadImgComponent){  
                //如果有上传组件
                //将上传组件移动到model中
                $webimg_modal.append(uploadImgComponent);
                //显示上传图片
                showUploadImg();
            }

            //切换
            $changeLinkId.click(function(e){
                var txt = $changeLinkId.text();
                if(txt.indexOf('本地') >= 0){
                    showUploadImg();
                }else{
                    showWebImg();
                }

                e.preventDefault();
            });
        });

        //添加 webImg
        $webimg_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $webimg_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var url = $.trim($('#' + urlTxtId).val()),
                title = $.trim($('#' + titleTxtId).val()),
                webimg_callback = function(){
                    //webimg callback
                    $('#' + urlTxtId).val('');
                    $('#' + titleTxtId).val('');
                };
            if(!url){
                //for IE6
                url = $.trim(document.getElementById(urlTxtId).value); 
                title = $.trim(document.getElementById(titleTxtId).value); 
            }
            if(url !== ''){
                //xss过滤
                if($E.filterXSSForUrl(url) === false){
                    alert('您的输入内容有不安全字符，请重新输入！');
                    return;
                }
                if(title === ''){
                    editor.command(e, 'insertImage', url, webimg_callback);
                }else{
                    editor.command(e, 'customeInsertImage', {'url':url, 'title':title}, webimg_callback);
                }
            }
        });

        return $webimg_modal;
    }
},
'insertSimpleCode':{
    'title': '插入代码',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-terminal',
    'modal': function(editor){
        var txtId = $E.getUniqeId(),
            selectId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content = '<p>请输入代码：{selectLangs}</p>' +  // selectLangs 待填充语言列表下拉框
                        '<div><textarea id="' + txtId + '" style="width:100%; height:100px;"></textarea></div>' + 
                        '<button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">插入</button>',
            selectLangs = '<select id="' + selectId + '">{content}</select>',  // content 待填充语言列表
            $simpleCode_modal;

        //获取语言列表（没有则返回 false）
        var hashljs = false,  //是否有高亮插件的标记。默认false
            hljs = window.hljs,  //引用了 highlightJS 插件之后才能得到
            listLanguages = hljs && hljs.listLanguages,
            langs = typeof listLanguages === 'function' && listLanguages(),
            langsStr = '';

        if(langs && typeof langs === 'object' && langs.length){
            //确定 langs 是数组

            //循环数组，获取语言列表
            $.each(langs, function(key, lang){
                langsStr = langsStr + 
                            '<option value="' + lang + '">' + 
                                lang + 
                            '</option>';
            });

            //语言下拉菜单
            selectLangs = selectLangs.replace('{content}', langsStr); //插入语言选项
            content = content.replace('{selectLangs}', selectLangs);  //插入下拉菜单

            //标记为有高亮插件
            hashljs = true;  

        }else{
            //无高亮插件，则不显示语言下拉菜单
            content = content.replace('{selectLangs}', '');
        }

        //生成modal，填充内容
        $simpleCode_modal = $(
            $E.htmlTemplates.modal.replace('{content}', content)
        );

        //插入代码
        $simpleCode_modal.find('#' + btnId).click(function(e){
            //获取并处理代码块
            var code = $.trim($('#' + txtId).val()),
                //callback回调事件
                simpleCode_callback = function(){
                    //清空代码区域
                    $('#' + txtId).val('');

                    //高亮显示代码
                    if( hashljs ){
                        $('pre code').each(function(i, block) {
                            // hljs 上面已经定义
                            hljs.highlightBlock(block);
                        });
                    }
                };

            //获取语言
            var lang;
            if(hashljs){
                lang = $('#' + selectId).val();
            }

            if(code && code !== ''){
                //替换特殊字符
                code = code.replace(/&/gm, '&amp;')
                           .replace(/</gm, '&lt;')
                           .replace(/>/gm, '&gt;');

                           //说明：之前的代码，集成highlight时注释，暂且保留
                           // .replace(/\n/gm, '<br>')
                           // .replace(/\s{1}/gm, '&nbsp;');

                if(hashljs){
                    //高亮代码块
                    code = $E.htmlTemplates.codePreWidthHightLight
                                .replace('{lang}', lang)
                                .replace('{content}', code);
                }else{
                    //普通代码块
                    code = $E.htmlTemplates.codePre.replace('{content}', code);
                }

                editor.command(e, 'insertHTML', code, simpleCode_callback);
            }
        });

        return $simpleCode_modal;
    }
},
'insertLocation':{
    'title': '插入位置',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-location',
    'modal': function(editor){
        var txtCityId = $E.getUniqeId(),
            txtLocationId = $E.getUniqeId(),
            btnSearchId = $E.getUniqeId(),
            btnClearId = $E.getUniqeId(),
            divMapId = $E.getUniqeId(),
            btnInsertId = $E.getUniqeId(),
            checkDynamicId = $E.getUniqeId();
        var content = ' 城市：<input type="text" id="' + txtCityId + '" style="width:60px;"/> ' + 
                      ' 位置：<input type="text" id="' + txtLocationId + '">' +
                      ' <button class="wangEditor-modal-btn" id="' + btnSearchId + '"  type="button">搜索</button>' + 
                      ' <button class="wangEditor-modal-btn" id="' + btnClearId + '"  type="button">清除位置</button>' +
                      ' <div id="' + divMapId + '" style="width:100%; height:220px; border:1px solid #ccc; margin:10px 0px;">地图加载中……</div>' +
                      ' <button class="wangEditor-modal-btn" id="' + btnInsertId +'"  type="button">插入位置</button>' +
                      ' <input type="checkbox" id="' + checkDynamicId + '"/>动态地图';
        var $location_modal = $(
                $E.htmlTemplates.modal.replace('{content}', content)
            );

        //地图使用到的变量
        var map,
            markers = [];

        //初始化map
        window.baiduMapCallBack = function(){
            map = new BMap.Map( divMapId );    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            //根据IP定位
            function locationFun(result){
                var cityName = result.name;
                map.setCenter(cityName);
                $('#' + txtCityId).val(cityName);
            }
            var myCity = new BMap.LocalCity();
            myCity.get(locationFun);

            //鼠标点击，创建位置
            map.addEventListener("click", function(e){
                var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); 
                map.addOverlay(marker);  
                marker.enableDragging();
                markers.push(marker);  //加入到数组中
            });
        };

        //异步加载 script
        $(function(){
            var ak = 'TVhjYjq1ICT2qqL5LdS8mwas';
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=baiduMapCallBack";  // baiduMapCallBack是一个本地函数
            document.body.appendChild(script);
        });

        //搜索位置
        $location_modal.find('#' + btnSearchId).click(function(e){
            var cityName = $.trim( $('#' + txtCityId).val() ),
                locationName = $.trim( $('#' + txtLocationId).val() ),
                myGeo,
                marker;
            
            if(cityName !== ''){
                if(!locationName || locationName === ''){
                    map.centerAndZoom(cityName, 11);
                }

                //地址解析
                if(locationName && locationName !== ''){
                    myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint(locationName, function(point){
                        if (point) {
                            map.centerAndZoom(point, 13);
                            marker = new BMap.Marker(point);
                            map.addOverlay(marker);
                            marker.enableDragging();  //允许拖拽
                            markers.push(marker);  //将marker加入到数组中
                        }else{
                            alert("没有找到您输入的地址!");
                            map.centerAndZoom(cityName, 11);  //找不到则重新定位到城市
                        }
                    }, cityName);
                }
            }
        });

        //清除位置
        $location_modal.find('#' + btnClearId).click(function(e){
            map.clearOverlays();
            markers = [];  //同时，清空marker数组
        });

        //插入位置的事件
        $location_modal.find('#' + btnInsertId).click(function(e){
            var isDynamic = $('#'+ checkDynamicId).is(':checked'),

                center = map.getCenter(),
                centerLng = center.lng,
                centerLat = center.lat,

                zoom = map.getZoom(),

                size = map.getSize(),
                sizeWidth = size.width,
                sizeHeight = size.height,

                position,
                src,
                iframe;

            if(isDynamic){
                //动态地址
                src = 'http://ueditor.baidu.com/ueditor/dialogs/map/show.html#';
            }else{
                //静态地址
                src = 'http://api.map.baidu.com/staticimage?';
            }

            //src参数
            src = src +'center=' + centerLng + ',' + centerLat +
                '&zoom=' + zoom +
                '&width=' + sizeWidth +
                '&height=' + sizeHeight;
            if(markers.length > 0){
                src = src + '&markers=';

                //添加所有的marker
                $.each(markers, function(key, value){
                    position = value.getPosition();
                    if(key > 0){
                        src = src + '|';
                    }
                    src = src + position.lng + ',' + position.lat;
                });
            }

            if(isDynamic){
                if(markers.length > 1){
                    alert('动态地图只能显示一个位置！');
                    return;
                }

                src += '&markerStyles=l,A';

                //插入iframe
                iframe = '<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="' + sizeWidth + '" height="' + sizeHeight + '"></iframe>';
                iframe = iframe.replace('{src}', src);
                editor.command(e, 'insertHTML', iframe);
            }else{
                //插入图片
                editor.command(e, 'insertImage', src);
            }
        });

        return $location_modal;
    }
},
'undo': {
    'title': '撤销',
    'type': 'btn',
    'hotKey': 'ctrl+z',  //例如'ctrl+z'/'ctrl,shift+z'/'ctrl,shift,alt+z'/'ctrl,shift,alt,meta+z'，支持这四种情况。只有type==='btn'的情况下，才可以使用快捷键
    'cssClass': 'icon-wangEditor-ccw',
    'command': 'commonUndo',
    'callback': function(editor){
    	//撤销时，会发生光标不准确的问题
    	//因此，撤销时，让编辑器失去焦点
    	editor.blur();
    }
},
'redo': {
    'title': '重复',
    'type': 'btn',
    'cssClass': 'icon-wangEditor-cw',
    'command': 'commonRedo',
    'callback': function(editor){
    	//redo时，会发生光标不准确的问题
    	//因此，redo时，让编辑器失去焦点
    	editor.blur();
    }
},
'viewSourceCode': {
    'title': '查看源码',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-code',
    'modal': function(editor){
        var txtId = $E.getUniqeId(),
            btnId = $E.getUniqeId();
        var content = '<div><textarea style="width:100%; height:200px;" id="' + txtId + '"></textarea></div>' +
                        '<button id="' + btnId + '" class="wangEditor-modal-btn"  type="button">更新源码</button>';
        var $sourceCode_modal = $(
                $E.htmlTemplates.modalBig.replace('{content}', content)
            );

        //显示源码
        $(function(){
            //注意，这是一步特殊处理！！！
            editor.$btnContainer.find('.icon-wangEditor-code') //找到<i>
                                .parent()  //找到 <a> 即 btn
            .click(function(e){
                var sourceCode = editor.html();
                //转译引号
                sourceCode = $E.replaceQuotes(sourceCode);
                $('#' + txtId).val( sourceCode );
            });
        });

        //更新源码
        $sourceCode_modal.find('#' + btnId).click(function(e){
            var sourceCode = $('#' + txtId).val();
            if( $.trim(sourceCode) === '' ){
                sourceCode = '<p><br></p>';
            }
            editor.command(e, 'replaceSourceCode', sourceCode);
        });

        return $sourceCode_modal;
    }
},
'fullScreen': {'title': '切换全屏',
    'type': 'btn',
    'cssClass': 'icon-wangEditor-enlarge2',
    'command': 'fullScreen'
}
		};
	}
});
$.extend($E.fn, {
	'initMenuConfig': function(){
		//默认的菜单显示配置
        this.editorMenuConfig = [
            ['viewSourceCode'],
            ['bold', 'underline', 'italic', 'foreColor', 'backgroundColor', 'strikethrough'],
            //['removeFormat'],
            ['blockquote', 'fontFamily', 'fontSize', 'setHead', 'list', 'justify'],
            //['indent', 'outdent'],
            //['insertHr'],
            ['createLink', 'unLink', 'insertTable', 'insertExpression'],
            ['insertImage', 'insertVideo', 'insertLocation','insertSimpleCode'],
            ['undo', 'redo', 'fullScreen']
        ];
	}
});
$.extend($E.fn, {

	//获取$btnContainer中带有commandName的btns
	'getCommandBtns': function(){
	    if(this.$btnsWithCommandName == null){
	        this.$btnsWithCommandName = this.$btnContainer.find('a[commandName]');
	    }
	    return this.$btnsWithCommandName;
	},

	//更新菜单btn样式
	'updateMenuStyle': function(){
	    var commandBtns = this.getCommandBtns();
	    if(commandBtns.length <= 0){
	        return;
	    }
	    //遍历所有带有commandName属性的按钮，如果当前正处于commandName状态，则按钮高亮显示
	    commandBtns.each(function(){
	        var $btn = $(this),
	            commandName = $.trim($btn.attr('commandName')).toLowerCase();
	        if(commandName === 'insertunorderedlist' || commandName === 'insertorderedlist'){
	            return;  //firefox中，如果是刚刷新的页面，无选中文本的情况下，执行这两个的 queryCommandState 报 bug
	        }
	        if($E.commandEnabled(commandName) && document.queryCommandState(commandName)){
	            $btn.addClass('wangEditor-btn-container-btn-selected');
	        }else{
	            $btn.removeClass('wangEditor-btn-container-btn-selected');
	        }
	    });
	}
	
});
$.extend($E.fn, {

    //设置或读取当前选中range的父元素
    'parentElemForCurrentRange': function(pe){
        if(pe){
            this.parentElem = pe;
        }else{
            return this.parentElem;
        }
    },

    //设置或读取当前选中的range
    'currentRange': function(cr){
        if(cr){
            this.currentRangeData = cr;
        }else{
            return this.currentRangeData;
        }
    },

    //获取并保存选择区域
    'saveSelection': function(range){
        //'initSelection'方法会传range参数过来
        //页面加载时，初始化selection

        var editor = this,
            selection,
            _parentElem,
            txt = editor.$txt[0];
        //获取选中区域
        if(supportRange){
            //w3c
            if(range){
                _parentElem = range.commonAncestorContainer;
            }else{
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    range = document.getSelection().getRangeAt(0);
                    _parentElem = range.commonAncestorContainer;
                }
            }
        }else{
            //IE8-
            range = document.selection.createRange();
            if(typeof range.parentElement === 'undefined'){
                //IE6、7中，insertImage后会执行此处
                //由于找不到range.parentElement，所以干脆将_parentElem赋值为null
                _parentElem = null;
            }else{
                _parentElem = range.parentElement();
            }
        }
        //确定选中区域在$txt之内
        if( _parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ){
            //将父元素保存一下
            editor.parentElemForCurrentRange( _parentElem );

            //保存已经选中的range
            editor.currentRange(range);
        }
    },

    //恢复当前选中区域
    'restoreSelection': function(){
        var editor = this,
            currentRange = editor.currentRange(),
            selection,
            range;

        if(!currentRange){
            return;
        }
        if(supportRange){
            //w3c
            selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(currentRange);
        }else{
            //IE8-
            range = document.selection.createRange();
            range.setEndPoint('EndToEnd', currentRange);
            if(currentRange.text.length === 0){
                range.collapse(false);
            }else{
                range.setEndPoint('StartToStart', currentRange);
            }
            range.select();
        }
    },

    //currentRange为空时，初始化为$txt的最后一个子元素
    'initSelection': function(){
        var editor = this,
            range,
            txt = editor.$txt.get(0);

        if( editor.currentRange() ){
            //如果currentRange有值，则不用再初始化
            return;
        }

        if(supportRange){ 
            //W3C方式
            range = document.createRange();
            range.setStart(txt, 0);
            range.setEnd(txt, 0);
        }

        //将range保存
        if(range){
            editor.saveSelection(range);
        }
    }
    
});
$.extend($E.fn, {
    'change': function(){
        var editor = this,
            html = editor.html();

        //editor.latestHtml中存储了最后一次修改之后的内容
        if(html.length !== editor.latestHtml.length || html !== editor.latestHtml){

            //替换其中的单引号、双引号
            html = $E.replaceQuotes(html);

            //强制显示table边框
            $E.showTableBorder(this.$txt);

            //将html保存到textarea
            editor.textareaVal(html);

            if(editor.onchange){
                //触发onchange事件
                editor.onchange(html);
            }

            //存储这次change后的html
            editor.latestHtml = html;
        }
    }
});
$.extend($E.fn, {

    '_initCommandRecord': function(){
        var editor = this,
            html = editor.html();
        editor.commandRecords = [];
        editor.commandRecords.push(html);
        editor.commandRecordCursor = 0;
    },

    'addCommandRecord': function(){
        var editor = this,
            length = editor.commandRecords.length,
            txt = editor.html();
        if(length > 0){
            if(txt === editor.commandRecords[editor.commandRecordCursor]){
                return;  //当前文字和记录中游标位置的文字一样，则不再记录
            }
        }
        //记录txt
        editor.commandRecords.push(txt);

        if(length >= comandRecordMaxLength){
            editor.commandRecords.shift();
        }

        //记录游标
        length = editor.commandRecords.length;
        editor.commandRecordCursor = length - 1;
    },

    'undo': function(){
        if(this.commandRecordCursor > 0){
            this.commandRecordCursor = this.commandRecordCursor - 1;
            this.html( this.commandRecords[this.commandRecordCursor] );
        }
    },
    
    'redo': function(){
        var editor = this,
            length = editor.commandRecords.length;
        if(editor.commandRecordCursor < length - 1){
            editor.commandRecordCursor = editor.commandRecordCursor + 1;
            editor.html( editor.commandRecords[editor.commandRecordCursor] );
        }
    }
});
$.extend($E.fn, {
	'commandHooks':{

        //插入html，for IE
        'insertHTML': function(commandName, commandValue){
            var $elem,
                currentRange = this.currentRange(),
                parentElem = this.parentElemForCurrentRange();
            
            if(!currentRange){
                return;
            }
            $elem = $E.getElemForInsertTable($(parentElem));
            if($elem.next().length === 0){
                commandValue += '<p><br/></p>';
            }
            $elem.after($(commandValue));
        },

        //自定义插入链接，包含title，target
        'customCreateLink': function(commandName, commandValue){
            var url = commandValue.url,
                title = commandValue.title,
                isBlank = commandValue.isBlank,
                id = $E.getUniqeId(),
                oldLinks,
                newLinks;

            //对当前的 a 先进行标记
            oldLinks = this.$txt.find('a');
            if(oldLinks.length > 0){
                oldLinks.attr(id, '1');
            }

            //执行
            document.execCommand("createLink", false, url);

            //获取新产生的 a （即没有标记）
            newLinks= this.$txt.find('a').not('[' + id + ']');
            if(title){
                newLinks.attr('title', title);
            }
            if(isBlank){
                newLinks.attr('target', '_blank');
            }

            //去掉上文对a的标记
            if(oldLinks.length > 0){
                oldLinks.removeAttr(id);
            }
        },

        //自定义插入image，包含title，alt
        'customeInsertImage': function(commandName, commandValue){
            var url = commandValue.url,
                title = commandValue.title,
                link = commandValue.link,
                id = $E.getUniqeId(),
                oldImgs,
                newImgs;

            //对当前的 img 先进行标记
            oldImgs = this.$txt.find('img');
            if(oldImgs.length > 0){
                oldImgs.attr(id, '1');
            }

            //执行
            document.execCommand("insertImage", false, url);

            //获取新产生的 img （即没有标记）
            newImgs = this.$txt.find('img').not('[' + id + ']');
            newImgs.attr('title', title);
            newImgs.attr('alt', title);

            //加链接
            if(link && typeof link === 'string'){
                newImgs.wrap('<a href="' + link + '" target="_blank"></a>');
            }

            //去掉上文对img的标记
            if(oldImgs.length > 0){
                oldImgs.removeAttr(id);
            }
        },

        //删除 $table $img 命令
        'delete$elem': function(commandName, commandValue){
            commandValue.remove();  //例如：$table.remove();
        },

        //撤销命令
        'commonUndo': function(commandName, commandValue){
            //this是editor对象
            this.undo(commandName, commandValue);
        },

        //重做命令
        'commonRedo': function(commandName, commandValue){
            //this是editor对象
            this.redo(commandName, commandValue);
        },

        //覆盖整个源码
        'replaceSourceCode': function(commandName, commandValue){
            this.html(commandValue);
        },
        
        //切换全屏
        'fullScreen': function(commandName, commandValue){
            var $txtContainer = this.$txtContainer,
                $editorContainer = this.getEditorContainer(),
                position =$editorContainer.css('position'),

                enlargeClass = 'icon-wangEditor-enlarge2',
                shrinkClass = 'icon-wangEditor-shrink2',

                $enlargeIcon = $editorContainer.find('.' + enlargeClass),
                $shrinkIcon = $editorContainer.find('.' + shrinkClass);

            //切换icon
            if($enlargeIcon.length){
                $enlargeIcon.removeClass(enlargeClass).addClass(shrinkClass);
            }else if($shrinkIcon.length){
                $shrinkIcon.removeClass(shrinkClass).addClass(enlargeClass);
            }

            if(position !== 'fixed'){
                //记录txtContainer高度
                this._txtContainerHeight = $txtContainer.height();
                //修改txtContainer高度
                $txtContainer.css({
                    'height': '90%'
                });

                //切换到全屏
                $editorContainer.css({
                    'position': 'fixed',
                    'top': 25,
                    'left': 20,
                    'right': 20,
                    'bottom': 20,
                    'z-index': 1000,

                    '-webkit-box-shadow': '0 0 30px #999', 
                    '-moz-box-shadow': '0 0 30px #999',
                    'box-shadow': '0 0 30px #999'
                });
            }else{
                //还原txtContainer高度
                $txtContainer.height(this._txtContainerHeight);
                //还原
                $editorContainer.css({
                    'position': 'relative',
                    'top': 0,
                    'left': 0,
                    'right': 0,
                    'bottom': 0,
                    'z-index': 0,

                    '-webkit-box-shadow': '0 0 0 #CCC', 
                    '-moz-box-shadow': '0 0 0 #CCC',
                    'box-shadow': '0 0 0 #CCC'
                });
            }
        }
    }
});
$.extend($E.fn, {
	'command': function(e, commandName, commandValue, callback){
        if( !this.currentRange() ){
            alert('未选中编辑区，无法执行操作');
        }else{
            var commandHook;

            //恢复选中区
            this.restoreSelection();

            //执行
            if($E.commandEnabled(commandName) === true){
                //针对html多做一步处理：在value后面加一个换行
                // if (commandName === 'insertHTML') {
                //     commandValue += '<p><br/></p>';
                // }
                // PS：以上代码不知之前为何添加，后来在tab键功能注释，暂且留着

                document.execCommand(commandName, false, commandValue);
            }else{
                commandHook = this.commandHooks[commandName];
                if(commandHook){
                    commandHook.call(this, commandName, commandValue);
                }else{
                    $E.consoleLog('不支持“' + commandName + '”命令，请检查。');
                }
            }

            //重新保存，否则chrome，360，safari，opera中会清空currentRange
            this.saveSelection();
            
            //执行回调函数
            if(callback && typeof callback === 'function'){
                callback(this);
            }

            //更新菜单样式
            this.updateMenuStyle();

            //记录，以便撤销
            this.addCommandRecord();

            //变化监控
            this.change();
        }

        //关闭modal
        this.hideModal();

        if(e){
            e.preventDefault();
        }
    }
});
if(!Array.prototype.indexOf){
    //IE低版本不支持 arr.indexOf 
    Array.prototype.indexOf = function(elem){
        var i = 0,
            length = this.length;
        for(; i<length; i++){
            if(this[i] === elem){
                return i;
            }
        }
        return -1;
    };
    //IE低版本不支持 arr.lastIndexOf
    Array.prototype.lastIndexOf = function(elem){
        var length = this.length;
        for(length = length - 1; length >= 0; length--){
            if(this[length] === elem){
                return length;
            }
        }
        return -1;
    };
}
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
});