/*
* wangEditor 1.3 js
* 王福朋
* 2015-03-30
*/
(function(window, $, undefined){

	//检测jquery是否正常
	if(!$){
		alert('检测到页面没有引用jQuery，请先引用，否则wangEditor将无法使用。');
	} else if(typeof $ !== 'function' || /^\d+\.\d+\.\d+$/.test($().jquery) === false){
		alert('检测到 window.jQuery 已被修改，wangEditor无法使用。');
	}

	//------------------------------------定义全局变量------------------------------------
	var document = window.document,
        $window = $(window),
        $body = $('body'),
		supportRange = typeof document.createRange === 'function',

        //id前缀
        idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
        globalNum = 1,

        //遮罩层
        $maskDiv = $('<div class="wangEditor-mask"></div>'),

        //最大的缓存步数
        comandRecordMaxLength = 10,

        //url中的不安全关键字
        urlUnsafeKeywords = ['javascript:', '<', '>', '(', ')'],

        //全局的构造函数
		$E = function($textarea, $initContent, menuConfig, onchange, uploadUrl){
            return new $E.fn.init($textarea, $initContent, menuConfig, onchange, uploadUrl);
        };
    //prototype简写为fn
    $E.fn = $E.prototype;

    //添加遮罩层
    $body.prepend($maskDiv);

    //------------------------------------公用方法------------------------------------
    $.extend($E, {
        //console.log提示
        'consoleLog': function(info){
            if(window.console && window.console.log){
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
            $.each(urlUnsafeKeywords, function(key, val){
                if(url.indexOf(val) >= 0){
                    result = false;
                }
            });
            return result;
        }
    });

    //------------------------------------基本配置------------------------------------
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
                '#000000': '黑色'
            },
            'fontsizeOptions': {
                1: '10px',
                2: '13px',
                3: '16px',
                4: '19px',
                5: '22px',
                6: '25px',
                7: '28px'
            }
        },
        //html模板
        'htmlTemplates': {
            //删除table,img的按钮
            'tableDeleteBtn': '<a href="#" class="wangEditor-tableDeleteBtn"><i class="icon-wangEditor-cancel"></i></a>',
            //整个编辑器的容器
            'editorContainer': '<div class="wangEditor-container"></div>',
            //菜单容器（加上clearfix）
            'btnContainer': '<div class="wangEditor-btn-container clearfix"></div>',
            //菜单组
            'btnContainerGroup': '<div class="wangEditor-btn-container-group"></div>',
            //单个菜单按钮（一定要有 herf='#'，否则无法监听blur事件）
            'btn': '<a class="wangEditor-btn-container-btn wangEditor-btn-container-btn-default" href="#"></a>', 
            //下拉按钮右侧的小三角
            'btnAngleDown': '<i class="icon-wangEditor-angle-down"></i>',
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
            'modalHeader': '<div class="wangEditor-modal-header">' + 
                                '<a href="#" commandName="close" class="wangEditor-modal-header-close"><i class="icon-wangEditor-cancel"></i></a>' + 
                                '<b>{title}</b>' + 
                                '<div class="wangEditor-modal-header-line"></div>' + 
                            '</div>',
            //编辑框的容器
            'txtContainer': '<div class="wangEditor-textarea-container"></div>',
            //编辑框
            'txt': '<div class="wangEditor-textarea" contenteditable="true"></div>',
            //dropmenu
            'dropMenu': '<ul class="wangEditor-drop-menu">{content}<ul>'
        }
    });

    //------------------------------------command相关------------------------------------
    $.extend($E, {
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
                return $elem.children().last();
            } else {
                return this.getElemForInsertTable($elem.parent());
            }
        }
    })
    
    //------------------------------------createMenu函数------------------------------------
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

            var dependence = menu.dependence,
                dependenceAlert = menu.dependenceAlert;

            if( ('dependence' in menu) && dependence == null ){
                //检测依赖
                $E.consoleLog(dependenceAlert);
                return;
            }

            var title = menu.title,
                type = menu.type,
                txt = menu.txt,
                txtArr,
                command = menu.command,  //函数或者字符串
                hotKey = menu.hotKey, //快捷键
                fnKeys = [],
                keyCode,
                $dropMenu = menu.dropMenu && menu.dropMenu(),
                $modal = menu.modal && menu.modal(editor),
                callback = menu.callback,
                $btn = $( $E.htmlTemplates.btn ),  
                resultArray = [$btn];

            if(typeof command === 'string'){
                command = $.trim(command);
            }

            //btn txt
            if(txt.indexOf('|') !== -1){
                txtArr = txt.split('|');
                txt = '<i class="' + txtArr[0] + '" style="' + txtArr[1] + '"></i>';
            }else{
                txt = '<i class="' + txt + '"></i>';
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
                    $btn.click(function(e){
                        editor.command(e, command, undefined, callback);
                    });
                }
                //自定义命令（command是函数）
                if(typeof command === 'function'){
                    $btn.click(function(e){
                        command(e);  //如果command是函数，则直接执行command
                    });
                }
                if(hotKey){
                    //快捷键
                    hotKey = hotKey.toLowerCase();
                    keyCode = $.trim( hotKey.split('+')[1] );
                    fnKeys = hotKey.split('+')[0].split(',');
                    $.each(fnKeys, function(key, value){
                        fnKeys[key] = $.trim(value);
                    });
                    function isFnKeys(e){
                        //判断功能键，暂时支持 ['ctrl', 'shift', 'alt', 'meta']
                        var flag = true;
                        $.each(['ctrl', 'shift', 'alt', 'meta'], function(key, value){
                            if(fnKeys.indexOf(value) !== -1 && !e[value + 'Key']){
                                flag = false;
                            }else if(fnKeys.indexOf(value) === -1 && e[value + 'Key']){
                                flag = false;
                            }
                        });
                        return flag
                    }
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
                $btn.append($( $E.htmlTemplates.btnAngleDown ));

                //渲染下拉菜单
                resultArray.unshift($dropMenu);

                function hideDropMenu(){
                    $dropMenu.hide();
                }
                $btn.click(function(e){
                    $dropMenu.css('display', 'inline-block');
                    e.preventDefault();
                    this.focus();  //for 360急速浏览器
                }).blur(function(e){
                    setTimeout(hideDropMenu, 200);  //先执行完，再隐藏
                });

                //命令（使用事件代理）
                $dropMenu.on('click', 'a[commandValue]', function(e){
                    var $this = $(this),
                        value = $this.attr('commandValue');
                    
                    editor.command(e, command, value, callback);
                });

                hideDropMenu();  //先隐藏起来
            }
            //弹出框
            else if(type === 'modal'){
                //$modal 头部信息
                $modal.prepend($(
                    $E.htmlTemplates.modalHeader.replace('{title}', title)
                ));

                //插入编辑器
                editor.insertModal($modal);

                $btn.click(function(e){
                    //计算margin-left;
                    $modal.css('margin-left', ($window.outerWidth()/2 - $modal.outerWidth()/2));

                    $maskDiv.show();
                    $modal.show();
                    e.preventDefault();
                });
                $modal.find('[commandName=close]').click(function(e){
                    $maskDiv.hide();
                    $modal.hide();
                    e.preventDefault();
                });
            }

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

                function showToolTip(){
                    $toolTip.css('display', 'inline-block');
                }
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


    //====================================
    //====================================分界线：工具函数/对象函数====================================
    //====================================

    
    //------------------------------------init初始化------------------------------------
    $.extend($E.fn, {
        //初始化函数
        'init': function($textarea, $initContent, menuConfig, onchange, uploadUrl){
            var editor = this,
                height = $textarea.height(),

                $tableDeleteBtn = $( $E.htmlTemplates.tableDeleteBtn ),  //删除table,img的按钮
                tableDeleteBtnDisabled;  //当前是否显示（删除table,img的按钮）

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
            editor.$txt.append($initContent);
            editor.$textarea = $textarea;

            editor.$txtContainer.append(editor.$txt);
            editor.$editorContainer
                .append(editor.$btnContainer)
                .append(editor.$modalContainer)
                .append(editor.$txtContainer)
                .append($tableDeleteBtn);

            //设置高度的最小值（再小了，文本框就显示不出来了）
            if(height <= 80){
                height = 80;
            }
            //设置高度（必须在dom渲染完之后才行）
            $(function(){
                //计算txtContainer的高度，必须等待页面加载完成才能计算，否则dom没有被渲染，无法计算高度
                var txtContainerHeight = height - editor.$btnContainer.outerHeight(); 
                txtContainerHeight = txtContainerHeight - 2;  //减去$editorContainer的上下两个边框宽度

                editor.$txtContainer.height( txtContainerHeight );
                editor.$txt.css('min-height', height + 'px');

                if(editor.$txt.outerHeight() !== height){
                    //IE6不支持'min-height'，就用空行模拟效果
                    editor.$txt.html(
                        editor.$txt.html() +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' +
                        '<p><br></p>' 
                    );
                }
            });

            //绑定onchange函数
            if(onchange && typeof onchange === 'function'){
                editor.onchange = onchange;
            }

            //绑定上传图片的url
            if(uploadUrl && typeof uploadUrl === 'string'){
                editor.uploadUrl = uploadUrl;
            }

            //初始化menus
            editor.initMenus();
            //配置menuConfig
            if(menuConfig && (menuConfig instanceof Array) === true && (menuConfig[0] instanceof Array) === true){  //需要确定menuConfig是二维数组才行
                //如果options中配置了menuConfig，直接复制给 editor.editorMenuConfig
                editor.editorMenuConfig = menuConfig;
            }
            //创建menu
            $.each(editor.editorMenuConfig, function(key, menuGroup){
                $E.createMenuGroup(menuGroup, editor);
            });


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
            });


            //显示删除table,img的按钮-----------------
            tableDeleteBtnDisabled = false;
            function hideTableDeleteBtn(){
                if(tableDeleteBtnDisabled){
                    $tableDeleteBtn.hide();
                    tableDeleteBtnDisabled = false;
                }
            }
            editor.$txt.on('click', 'table,img', function(){
                var $elem = $(this),
                    txtTop = editor.$txt.position().top,
                    tableTop = $elem.position().top,
                    tableLeft = $elem.position().left,
                    btnWidth = $tableDeleteBtn.width(),
                    btnHeight = $tableDeleteBtn.height();
                if(tableTop <= txtTop){
                    return;
                }
                $tableDeleteBtn.css({
                    'top': (tableTop - btnHeight/2) + 'px',
                    'left': (tableLeft - btnWidth/2) + 'px'
                });
                $tableDeleteBtn.show();
                tableDeleteBtnDisabled = true;

                //滚动时隐藏
                editor.$txtContainer.off('scroll');
                editor.$txtContainer.on('scroll', hideTableDeleteBtn);

                //点击btn，删除
                $tableDeleteBtn.off();
                $tableDeleteBtn.click(function(e){
                    //统一用editor.command删除，方便撤销
                    editor.command(e, 'delete$elem', $elem, hideTableDeleteBtn);  
                });
            }).on('keyup blur', function(){
                setTimeout(hideTableDeleteBtn, 100); //预留0.1毫秒，等待 $tableDeleteBtn.click 执行
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

            //返回------------------
            return editor;
        },

        //往menu中插入btn Group
        'insertMenuGroup': function($btnGroup){
            this.$btnContainer.append($btnGroup);
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
            if(html){
                this.$txt.html(html);
            }else{
                return this.$txt.html();
            }
        },

        //设置textarea的值
        'textareaVal':function(val){
            if(val){
                this.$textarea.val(val);
            }else{
                return this.$textarea.val();
            }
        }

    });

    //重点！！！
    //构造函数是$E.fn.init，将构造函数的prototype指向$E.fn
    //模仿jquery写法
    $E.fn.init.prototype = $E.fn;

    //------------------------------------菜单配置------------------------------------
    $.extend($E.fn, {
        'initMenus': function(){
            //菜单配置集
            /*
                menus = {
                    'menuId-1': {
                        'title': （字符串，必须）标题,
                        'type':（字符串，必须）类型，可以是 btn / dropMenu / modal,
                        'txt': （字符串，必须）fontAwesome字体样式，例如 'fa fa-head',
                        'hotKey':（字符串，可选）快捷键，如'ctrl + b', 'ctrl,shift + i', 'alt,meta + y'等，支持 ctrl, shift, alt, meta 四个功能键（只有type===btn才有效）,
                        'command':（字符串）document.execCommand的命令名，如'fontName'；也可以是自定义的命令名，如“撤销”、“插入表格”按钮（type===modal时，command无效）,
                        'dropMenu': （$ul，可选）type===dropMenu时，要返回一个$ul，作为下拉菜单,
                        'modal':（$div，可选）type===modal是，要返回一个$div，作为弹出框,
                        'callback':（函数，可选）回调函数,

                        'dependence': （任何对象，可选）依赖对象，在加载菜单时，会判断该对象是否是null/undefined，如果是，就不显示,
                        'dependenceAlert': （字符串，可选）依赖对象找不到时候的提示
                    },
                    'modaId-2':{
                        ……
                    }
                }
            */
            this.menus = {
                'fontFamily': {
                    'title': '字体',
                    'type': 'dropMenu',
                    'txt': 'icon-wangEditor-font',
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
                    'txt': 'icon-wangEditor-text-height',
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
                'bold': {
                    'title': '加粗',
                    'type': 'btn',
                    'hotKey': 'ctrl + b',
                    'txt':'icon-wangEditor-bold',
                    'command': 'bold',
                    'callback': function(editor){
                        //console.log(editor);
                    }
                },
                'underline': {
                    'title': '下划线',
                    'type': 'btn',
                    'hotKey': 'ctrl + u',
                    'txt':'icon-wangEditor-underline',
                    'command': 'underline '
                },
                'italic': {
                    'title': '斜体',
                    'type': 'btn',
                    'hotKey': 'ctrl + i',
                    'txt':'icon-wangEditor-italic',
                    'command': 'italic '
                },
                'setHead': {
                    'title': '设置标题',
                    'type': 'dropMenu', 
                    'txt':'icon-wangEditor-header',
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
                    'title': '前景色',
                    'type': 'dropMenu',
                    'txt': 'icon-wangEditor-pencil',   //如果要颜色： 'txt': 'fa fa-pencil|color:#4a7db1'
                    'command': 'foreColor ',
                    'dropMenu': function(){
                        var arr = [],
                            //注意，此处commandValue必填项，否则程序不会跟踪
                            temp = '<li><a href="#" commandValue="${value}" style="color:${color};">${txt}</a></li>',
                            $ul;

                        $.each($E.styleConfig.colorOptions, function(key, value){
                            arr.push(
                                temp.replace('${value}', key)
                                    .replace('${color}', key)
                                    .replace('${txt}', value)
                            );
                        });
                        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
                        return $ul; 
                    }
                },
                'backgroundColor': {
                    'title': '背景色',
                    'type': 'dropMenu',
                    'txt': 'icon-wangEditor-brush',   //如果要颜色： 'txt': 'fa fa-paint-brush|color:Red'
                    'command': 'backColor ',
                    'dropMenu': function(){
                        var arr = [],
                            //注意，此处commandValue必填项，否则程序不会跟踪
                            temp = '<li><a href="#" commandValue="${value}" style="background-color:${color};color:#ffffff;">${txt}</a></li>',
                            $ul;

                        $.each($E.styleConfig.colorOptions, function(key, value){
                            arr.push(
                                temp.replace('${value}', key)
                                    .replace('${color}', key)
                                    .replace('${txt}', value)
                            );
                        });
                        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
                        return $ul; 
                    }
                },
                'removeFormat': {
                    'title': '清除格式',
                    'type': 'btn',
                    'txt':'icon-wangEditor-eraser',
                    'command': 'RemoveFormat ' 
                },
                'indent': {
                    'title': '增加缩进',
                    'type': 'btn',
                    'hotKey': 'ctrl,shift + i',
                    'txt':'icon-wangEditor-indent-right',
                    'command': 'indent'
                },
                'outdent': {
                    'title': '减少缩进',
                    'type': 'btn',
                    'txt':'icon-wangEditor-indent-left',
                    'command': 'outdent'
                },
                'unOrderedList': {
                    'title': '无序列表',
                    'type': 'btn',
                    'txt':'icon-wangEditor-list-bullet',
                    'command': 'InsertUnorderedList '
                },
                'orderedList': {
                    'title': '有序列表',
                    'type': 'btn',
                    'txt':'icon-wangEditor-list-numbered',
                    'command': 'InsertOrderedList '
                },
                'justifyLeft': {
                    'title': '左对齐',
                    'type': 'btn',
                    'txt':'icon-wangEditor-align-left',
                    'command': 'JustifyLeft '   
                },
                'justifyCenter': {
                    'title': '居中',
                    'type': 'btn',
                    'txt':'icon-wangEditor-align-center',
                    'command': 'JustifyCenter'  
                },
                'justifyRight': {
                    'title': '右对齐',
                    'type': 'btn',
                    'txt':'icon-wangEditor-align-right',
                    'command': 'JustifyRight ' 
                },
                'createLink': {
                    'title': '插入链接',
                    'type': 'modal', 
                    'txt': 'icon-wangEditor-link',
                    'modal': function (editor) {
                        var urlTxtId = $E.getUniqeId(),
                            titleTxtId = $E.getUniqeId(),
                            blankCheckId = $E.getUniqeId(),
                            btnId = $E.getUniqeId();
                            content = '链接：<input id="' + urlTxtId + '" type="text" style="width:300px;"/><br />' +
                                        '标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/><br />' + 
                                        '新窗口：<input id="' + blankCheckId + '" type="checkbox" checked="checked"/><br />' +
                                        '<button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入链接</button>',
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
                                    alert('您的输入内容有不安全字符，请重新输入！')
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
                'unLink': {
                    'title': '取消链接',
                    'type': 'btn',
                    'txt':'icon-wangEditor-unlink',
                    'command': 'unLink ' 
                },
                'insertHr': {
                    'title': '插入横线',
                    'type': 'btn',
                    'txt':'icon-wangEditor-minus',
                    'command': 'InsertHorizontalRule' 
                },
                'insertTable': {
                    'title': '插入表格',
                    'type': 'modal',
                    'txt': 'icon-wangEditor-table',
                    'modal': function(editor){
                        var rowNumTxtId = $E.getUniqeId(),
                            colNumTxtId = $E.getUniqeId(),
                            titleCheckId = $E.getUniqeId(),
                            btnId = $E.getUniqeId(),
                            content = '行数：<input id="' + rowNumTxtId + '" type="text" style="width:30px;"/>' + 
                                        '列数：<input id="' + colNumTxtId + '" type="text"  style="width:30px;"/>' +
                                        '显示标题行：<input id="' + titleCheckId + '" type="checkbox" checked="checked"/>' + 
                                        '&nbsp;&nbsp;&nbsp;&nbsp;' +
                                        '<button id="' + btnId + '" class="wangEditor-modal-btn">插入表格</button>',
                            $table_modal = $(
                                $E.htmlTemplates.modalSmall.replace('{content}', content)
                            );
                        $table_modal.find('#' + btnId).click(function(e){
                            //注意，该方法中的 $table_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
                            //具体原因还未查证？？？

                            var rowNum = $('#' + rowNumTxtId).val(),
                                rowNum = rowNum === '' || isNaN(+rowNum) ? 3 : rowNum,
                                colNum = $('#' + colNumTxtId).val(),
                                colNum = colNum === '' || isNaN(+colNum) ? 5 : colNum,
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
                                tdTemp_FirstRow = '<td style="width:100px;">&nbsp;</td>'
                                tdTemp = '<td>&nbsp;</td>';
                            
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
                'webImage': {
                    'title': '网络图片',
                    'type': 'modal',
                    'txt': 'icon-wangEditor-picture',
                    'modal': function (editor) {
                        var urlTxtId = $E.getUniqeId(),
                            titleTxtId = $E.getUniqeId(),
                            btnId = $E.getUniqeId(),
                            content = '网址：<input id="' + urlTxtId + '" type="text" style="width:300px;"/><br/>' +
                                        '标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/><br/>' +
                                        '<button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入图片</button>',
                            $webimg_modal = $(
                                $E.htmlTemplates.modalSmall.replace('{content}', content)
                            );

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
                                    alert('您的输入内容有不安全字符，请重新输入！')
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
                'uploadImg':{
                    'title': '上传图片',
                    'type': 'modal',
                    'txt': 'icon-wangEditor-file-image',
                    'modal': function(editor){
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
                                        '   选择文件：<input type="file" name="' + fileInputName + '" id="' + fileId + '"/><br/>' +
                                        '   图片标题：<input type="text" id="' + titleTxtId + '" style="width:250px;"/><br/>' +
                                        '   <button id="' + btnId + '" class="wangEditor-modal-btn">上传</button>' +
                                        '   <span stype="color:red;" id="' + infoId + '"></span>' +
                                        '</form>' +
                                        '<iframe id="' + iframeId + '" name="' + iframeId + '" style="display:none;"></iframe>',
                            $uploadImg_modal = $(
                                $E.htmlTemplates.modalSmall.replace('{content}', content)
                            );
                        
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
                            ext = '|' + ext.toLowerCase() + '|'
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

                            //先暂时禁用按钮
                            $btn.hide();
                            $info.html('上传中...');

                            try{
                                //设置uploadUrl，提交form
                                $form.attr('action', uploadUrl);
                                $form.submit();

                                //定义callback事件
                                window.wangEditor_uploadImgCallback = function(result){
                                    var url;
                                    if(result.indexOf('ok') === 0){
                                        //成功
                                        url = result.split('|')[1];

                                        if(title === ''){
                                            editor.command(e, 'insertImage', url, uploadImg_callback);
                                        }else{
                                            editor.command(e, 'customeInsertImage', {'url':url, 'title':title}, uploadImg_callback);
                                        }
                                        
                                    }else{
                                        //失败
                                        alert(result);
                                    }
                                };
                            }catch(ex){
                                alert(ex.name + ':' + ex.message);
                            }finally{
                                //恢复按钮状态
                                $btn.show();
                                $info.html('');
                                e.preventDefault();
                            }
                        });

                        return $uploadImg_modal;
                    }
                },
                'insertSimpleCode':{
                    'title': '插入代码',
                    'type': 'modal',
                    'txt': 'icon-wangEditor-terminal',
                    'modal': function(editor){
                        var txtId = $E.getUniqeId(),
                            btnId = $E.getUniqeId(),
                            content = '<p>请输入代码：</p>' +
                                        '<textarea id="' + txtId + '" style="width:100%; height:100px;"></textarea>' + 
                                        '<button id="' + btnId + '" class="wangEditor-modal-btn">插入</button>',
                            $simpleCode_modal = $(
                                $E.htmlTemplates.modalSmall.replace('{content}', content)
                            );

                        $simpleCode_modal.find('#' + btnId).click(function(e){
                            var code = $.trim($('#' + txtId).val()),
                                simpleCode_callback = function(){
                                    $('#' + txtId).val('');
                                };

                            if(code && code !== ''){
                                //替换特殊字符
                                code = code.replace(/&/gm, '&amp;')
                                           .replace(/</gm, '&lt;')
                                           .replace(/>/gm, '&gt;')
                                           .replace(/\n/gm, '<br>')
                                           .replace(/\s{1}/gm, '&nbsp;');
                                code = '<pre class="wangEditor-code">' + code + '</pre><p><br></p>';

                                editor.command(e, 'insertHtml', code, simpleCode_callback);
                            }
                        });

                        return $simpleCode_modal;
                    }
                },
                'undo': {
                    'title': '撤销',
                    'type': 'btn',
                    'hotKey': 'ctrl+z',  //例如'ctrl+z'/'ctrl,shift+z'/'ctrl,shift,alt+z'/'ctrl,shift,alt,meta+z'，支持这四种情况。只有type==='btn'的情况下，才可以使用快捷键
                    'txt': 'icon-wangEditor-ccw',
                    'command': 'commonUndo'
                },
                'redo': {
                    'title': '重复',
                    'type': 'btn',
                    'txt': 'icon-wangEditor-cw',
                    'command': 'commonRedo'
                }
            };

            //默认的菜单显示配置
            this.editorMenuConfig = [
                ['fontFamily', 'fontSize'],
                ['bold', 'underline', 'italic'],
                ['setHead', 'foreColor', 'backgroundColor', 'removeFormat'],
                ['indent', 'outdent'],
                ['unOrderedList', 'orderedList'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'] ,
                ['createLink', 'unLink'],
                ['insertHr', 'insertTable', 'webImage', 'uploadImg', 'insertSimpleCode'],
                ['undo', 'redo']
            ];
        }
    });

    //------------------------------------更新菜单样式------------------------------------
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

    //------------------------------------selection range相关------------------------------------
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
        'saveSelection': function(){
            var editor = this,
                selection,
                range,
                _parentElem,
                txt = editor.$txt[0];
            //获取选中区域
            if(supportRange){
                //w3c
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    range = document.getSelection().getRangeAt(0);
                    _parentElem = range.commonAncestorContainer;
                }
            }else{
                //IE8-
                range = document.selection.createRange();
                _parentElem = range.parentElement();
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
        }
    });

    //------------------------------------change事件------------------------------------
    $.extend($E.fn, {
        'change': function(){
            var editor = this,
                html = editor.html();

            //editor.latestHtml中存储了最后一次修改之后的内容
            if(html.length !== editor.latestHtml.length || html !== editor.latestHtml){
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

    //------------------------------------撤销/重做------------------------------------
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

    //------------------------------------command------------------------------------
    $.extend($E.fn, {
        //commandHooks:
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
                    commandValue += '<p>&nbsp;</p>';
                }
                $elem.after($(commandValue));
            },
            //自定义插入链接，包含title，target
            'customCreateLink': function(commandName, commandValue){
                var url = commandValue['url'],
                    title = commandValue['title'],
                    isBlank = commandValue['isBlank'],
                    parentElem = this.parentElemForCurrentRange(),
                    $parentElem,
                    id = $E.getUniqeId(),
                    oldLinks,
                    newLinks;

                //获取父节点（必须是element，不能是textNode）
                while(parentElem.nodeType !== 1){
                    parentElem = parentElem.parentNode;
                }
                $parentElem = $(parentElem);

                //对当前的 a 先进行标记
                oldLinks = $parentElem.find('a');
                if(oldLinks.length > 0){
                    oldLinks.attr(id, '1');
                }

                //执行
                document.execCommand("createLink", false, url);

                //获取新产生的 a （即没有标记）
                newLinks= $parentElem.find('a').not('[' + id + ']');
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
                var url = commandValue['url'],
                    title = commandValue['title'],
                    parentElem = this.parentElemForCurrentRange(),
                    $parentElem,
                    id = $E.getUniqeId(),
                    oldImgs,
                    newImgs;

                //获取父节点（必须是element，不能是textNode）
                while(parentElem.nodeType !== 1){
                    parentElem = parentElem.parentNode;
                }
                $parentElem = $(parentElem);

                //对当前的 img 先进行标记
                oldImgs = $parentElem.find('img');
                if(oldImgs.length > 0){
                    oldImgs.attr(id, '1');
                }

                //执行
                document.execCommand("insertImage", false, url);

                //获取新产生的 a （即没有标记）
                newImgs= $parentElem.find('img').not('[' + id + ']');
                newImgs.attr('title', title);
                newImgs.attr('alt', title);

                //去掉上文对a的标记
                if(oldImgs.length > 0){
                    oldImgs.removeAttr(id);
                }
            },
            //删除 $table $img
            'delete$elem': function(commandName, commandValue){
                commandValue.remove();  //例如：$table.remove();
            },
            'commonUndo': function(commandName, commandValue){
                this.undo(commandName, commandValue);
            },
            'commonRedo': function(commandName, commandValue){
                this.redo(commandName, commandValue);
            }
        },

        //command
        'command': function(e, commandName, commandValue, callback){
            if( !this.currentRange() ){
                alert('未选中编辑区，无法执行操作');
            }else{
                var commandHook;

                //恢复选中区
                this.restoreSelection();

                //执行
                if($E.commandEnabled(commandName) === true){
                    document.execCommand(commandName, false, commandValue);
                }else{
                    commandHook = this.commandHooks[commandName];
                    if(commandHook){
                        commandHook.call(this, commandName, commandValue);
                    }else{
                        $E.consoleLog('不支持“' + commandName + '”命令，请检查');
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
            this.$modalContainer.find('.wangEditor-modal:visible').hide();
            if($maskDiv.is(':visible')){
                $maskDiv.hide();  //关闭遮罩层
            }

            if(e){
                e.preventDefault();
            }
        }
    });

    //------------------------------------完善IE的Array操作------------------------------------
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
        }
        //IE低版本不支持 arr.lastIndexOf
        Array.prototype.lastIndexOf = function(elem){
            var length = this.length;
            for(length = length - 1; length >= 0; length--){
                if(this[length] === elem){
                    return length;
                }
            }
            return -1;
        }
    }

    //------------------------------------生成jquery插件------------------------------------
    $.fn.extend({
        /*
        * options: {
        *   $initContent: $elem, //配置要初始化内容
        *   menuConfig: [...],   //配置要显示的菜单（menuConfig会覆盖掉hideMenuConfig）
        *   onchange: function(){...},  //配置onchange事件，
        *   uploadUrl: string  //图片上传的地址
        * }
        */
        'wangEditor': function(options){
            if(this[0].nodeName !== 'TEXTAREA'){
                //只支持textarea
                alert('wangEditor提示：请使用textarea扩展富文本框。详情可参见作者的demo.html');
                return;
            }

            var options = options || {},
                menuConfig = options.menuConfig,
                $initContent = options.$initContent || $(),
                onchange = options.onchange,
                uploadUrl = options.uploadUrl;

            //获取editor对象
            var editor = $E(this, $initContent, menuConfig, onchange, uploadUrl);
            this.before(editor.$editorContainer);
            this.hide();
        }
    });

})(window, window.jQuery);