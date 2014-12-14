(function (window, undefined) {
	//验证jQuery
    if (!window.jQuery) {
        return;
    }
    var document = window.document,
		$ = window.jQuery,
		supportRange = typeof document.createRange === 'function',
	    defaultHeight = 100,
	    menus,  //存储菜单配置
		currentRange,      //记录当前选中范围
        $txt = $('<div contenteditable="true" class="textarea" ></div>'),  //编辑区
        $btnContainer = $('<div class="btn-container"></div>'), //菜单容器
        $maskDiv = $('<div class="mask"></div>'),  //遮罩层
        $modalContainer = $('<div></div>'),  //modal容器
        $allMenusWithCommandName,

        commandHooks, 
        idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
        id = 1,

        //基本配置
        basicConfig = {
            fontFamilyOptions: ['宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'],
            colorOptions: {
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
            fontsizeOptions: {
                1: '10px',
                2: '13px',
                3: '16px',
                4: '19px',
                5: '22px',
                6: '25px',
                7: '28px'
            }
        };

    //获取唯一ID
    function getUniqeId () {
        return idPrefix + '_' + (id++);
    }

	//selection range 相关事件
    function getCurrentRange() {
        var selection,
            range,
            parentElem,
            txt = $txt[0];
        //获取选中区域
        if(supportRange){
            //w3c
            selection = document.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                range = document.getSelection().getRangeAt(0);
                parentElem = range.commonAncestorContainer;
            }
        }else{
            //IE8-
            range = document.selection.createRange();
            parentElem = range.parentElement();
        }
        //确定选中区域在$txt之内
        if( parentElem && (parentElem.id = txt.id || $.contains(txt, parentElem)) ){
            return range;
        }
    }
    function saveSelection() {
        currentRange = getCurrentRange();
    }
    function restoreSelection() {
        if(!currentRange){
            return;
        }
        var selection,
            range;
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

    //获取可以插入表格的元素，用于 commandHooks['insertHTML']
    function getElemForInsertTable($elem){
        if ($elem.parent().is('div[contenteditable="true"]')) {
            return $elem;
        }
        if ($elem[0].nodeName.toLowerCase() === 'body') {
            return $txt.children().last();
        }
        if ($elem.is('div[contenteditable="true"]')) {
            return $elem.children().last();
        } else {
            return getElemForInsertTable($elem.parent());
        }
    }
    //命令 hook
    commandHooks = {
        'insertHTML': function(commandName, commandValue){
            var parentElem,
                $elem;
            if(currentRange){
                if(supportRange){
                    parentElem = currentRange.commonAncestorContainer;
                }else{
                    parentElem = currentRange.parentElement();
                }
            }else{
                return;
            }
            $elem = getElemForInsertTable($(parentElem));
            if($elem.next().length === 0){
                commandValue += '<p>&nbsp;</p>';
            }
            $elem.after($(commandValue));
        }
    };
    //检验 command Enable
    function commandEnabled(commandName){
        var enabled;
        try{
            enabled = document.queryCommandEnabled(commandName);
        }catch(ex){
            enabled = false;
        }
        return enabled;
    }
    //执行命令
    function commonCommand (e, commandName, commandValue, callback) {
        var commandHook;

        //恢复选中区
        restoreSelection();
        if(!currentRange){
            e.preventDefault();
            return;
        }

        //执行
        if(commandEnabled(commandName) === true){
            document.execCommand(commandName, false, commandValue);
        }else{
            commandHook = commandHooks[commandName];
            if(commandHook){
                commandHook(commandName, commandValue);
            }
        }
        
        //执行回调函数
        if(callback){
            callback.call($txt);
        }

        //更新菜单样式
        updateMenuStyle();

        //关闭modal
        $modalContainer.find('.modal').hide();
        $maskDiv.hide();

        e.preventDefault();
    }

    //更新菜单样式
    function updateMenuStyle() {
        if(!$allMenusWithCommandName){
            $allMenusWithCommandName = $btnContainer.find('a[commandName]');
        }
        $allMenusWithCommandName.each(function(){
            var $btn = $(this),
                commandName = $.trim($btn.attr('commandName')).toLowerCase();
            if(commandName === 'insertunorderedlist' || commandName === 'insertorderedlist'){
                return;  //ff中，如果是刚刷新的页面，无选中文本的情况下，执行这两个的 queryCommandState 报 bug
            }
            if(document.queryCommandState(commandName)){
                $btn.addClass('btn-selected');
            }else{
                $btn.removeClass('btn-selected');
            }
        });
    }
    //菜单配置集
    menus = [
        {
            'title': '字体',
            'type': 'dropMenu',
            'txt': 'fa fa-font',
            'command': 'fontName ',
            'dropMenu': (function(){
                var arr = [],
                    //注意，此处commandValue必填项，否则程序不会跟踪
                    temp = '<li><a href="#" commandValue="${value}" style="font-family:${family};">${txt}</a></li>',
                    $ul;

                $.each(basicConfig.fontFamilyOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', value)
                            .replace('${family}', value)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
            })()
        },
        {
            'title': '字号',
            'type': 'dropMenu',
            'txt': 'fa fa-text-height',
            'command': 'fontSize',
            'dropMenu': (function () {
                var arr = [],
                    //注意，此处commandValue必填项，否则程序不会跟踪
                    temp = '<li><a href="#" commandValue="${value}" style="font-size:${fontsize};">${txt}</a></li>',
                    $ul;

                $.each(basicConfig.fontsizeOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${fontsize}', value)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
            })()
        },
        'split',
    	{
            'title': '加粗',
    		'type': 'btn',
    		'txt':'fa fa-bold',
    		'command': 'bold',
            'callback': function(){
                //alert('自定义callback函数');
            }
    	},
        {
            'title': '下划线',
            'type': 'btn',
            'txt':'fa fa-underline',
            'command': 'underline '
        },
        {
            'title': '斜体',
            'type': 'btn',
            'txt':'fa fa-italic',
            'command': 'italic '
        },
        'split',
        {
            'title': '前景色',
            'type': 'dropMenu',
            'txt': 'fa fa-pencil|color:#4a7db1',
            'command': 'foreColor ',
            'dropMenu': (function(){
                var arr = [],
                    //注意，此处commandValue必填项，否则程序不会跟踪
                    temp = '<li><a href="#" commandValue="${value}" style="color:${color};">${txt}</a></li>',
                    $ul;

                $.each(basicConfig.colorOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${color}', key)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
            })()
        },
        {
            'title': '背景色',
            'type': 'dropMenu',
            'txt': 'fa fa-paint-brush|color:Red',
            'command': 'backColor ',
            'dropMenu': (function(){
                var arr = [],
                    //注意，此处commandValue必填项，否则程序不会跟踪
                    temp = '<li><a href="#" commandValue="${value}" style="background-color:${color};color:#ffffff;">${txt}</a></li>',
                    $ul;

                $.each(basicConfig.colorOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${color}', key)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
            })()
        },
        'split',
        {
            'title': '无序列表',
            'type': 'btn',
            'txt':'fa fa-list-ul',
            'command': 'InsertUnorderedList '
        },
        {
            'title': '有序列表',
            'type': 'btn',
            'txt':'fa fa-list-ol',
            'command': 'InsertOrderedList '
        },
        'split',
        {
            'title': '左对齐',
            'type': 'btn',
            'txt':'fa fa-align-left',
            'command': 'JustifyLeft '   
        },
        {
            'title': '居中',
            'type': 'btn',
            'txt':'fa fa-align-center',
            'command': 'JustifyCenter'  
        },
        {
            'title': '右对齐',
            'type': 'btn',
            'txt':'fa fa-align-right',
            'command': 'JustifyRight ' 
        },
        'split',
    	{
            'title': '插入链接',
    		'type': 'modal',
    		'txt': 'fa fa-link',
    		'modal': (function () {
                var urlTxtId = getUniqeId(),
                    btnId = getUniqeId();
                    $modal = $(
                        '<div>' +
                        '   <input id="' + urlTxtId + '" type="text" style="width:300px;"/>' + 
                        '   <button id="' + btnId + '" type="button">插入链接</button>' + 
                        '</div>'
                    ),
                    callback = function(){
                        $modal.find('#' + urlTxtId).val('');
                    };
                $modal.find('#' + btnId).click(function(e){
                    var url = $.trim($modal.find('#' + urlTxtId).val());
                    if(!url){
                        url = document.getElementById(urlTxtId).value;  //for IE6
                    }
                    if(url !== ''){
                        commonCommand(e, 'createLink', url, callback);
                    }
                });

    			return $modal;
    		})()
    	},
        {
            'title': '取消链接',
            'type': 'btn',
            'txt':'fa fa-unlink',
            'command': 'unLink ' 
        },
        'split',
        {
            'title': '插入表格',
            'type': 'modal',
            'txt': 'fa fa-table',
            'modal': (function(){
                var rowNumTxtId = getUniqeId(),
                    colNumTxtId = getUniqeId(),
                    titleCheckId = getUniqeId(),
                    btnId = getUniqeId(),
                    $modal = $(
                        '<div>' + 
                        '   行数：<input id="' + rowNumTxtId + '" type="text" style="width:30px;"/>' + 
                        '   列数：<input id="' + colNumTxtId + '" type="text"  style="width:30px;"/>' +
                        '   显示标题行：<input id="' + titleCheckId + '" type="checkbox">' + 
                        '   <button id="' + btnId + '">插入表格</button>',
                        '</div>'
                    ),
                    callback = function(){
                        $modal.find('input').val('');
                    };
                $modal.find('#' + btnId).click(function(e){
                    var rowNum = $modal.find('#' + rowNumTxtId).val(),
                        rowNum = rowNum === '' || isNaN(+rowNum) ? 3 : rowNum,
                        colNum = $modal.find('#' + colNumTxtId).val(),
                        colNum = colNum === '' || isNaN(+colNum) ? 5 : colNum,
                        firstRowBold = $modal.find('#' + titleCheckId).is(':checked'),

                        i, j,
                        //表格模板
                        table = '',
                        tableTemp = '<table border="0" cellpadding="0" cellspacing="0" style="${style}" > ${content} </table>',
                        trArray = [],
                        firstTrTemp = '<tr style="font-weight:bold;background-color:#f1f1f1;">${content}</tr>',
                        trTemp = '<tr>${content}</tr>',
                        tdArray = [],
                        tdTemp = '<td style="width:100px; ${style}">&nbsp;</td>',
                        borderStyle = '1px solid #cccccc';
                    //完善模板
                    tableTemp = tableTemp.replace('${style}', 'border-left:' + borderStyle + ';border-top:' + borderStyle + ';');
                    tdTemp = tdTemp.replace('${style}', 'border-bottom:' + borderStyle + ';border-right:' + borderStyle + ';');
                    
                    //生成table代码
                    for (i = 0; i < rowNum; i++) {
                        tdArray = [];
                        for (j = 0; j < colNum; j++) {
                            tdArray.push(tdTemp);
                        }
                        if (i === 0 && firstRowBold) {
                            trArray.push(firstTrTemp.replace('${content}', tdArray.join('')));
                        } else {
                            trArray.push(trTemp.replace('${content}', tdArray.join('')));
                        }
                    }
                    table = tableTemp.replace('${content}', trArray.join(''));

                    //执行插入
                    commonCommand(e, 'insertHTML', table, callback);
                });
                return $modal;
            })()
        },
        {
            'title': '插入图片',
            'type': 'modal',
            'txt': 'fa fa-image',
            'modal': (function () {
                var urlTxtId = getUniqeId(),
                    btnId = getUniqeId();
                    $modal = $(
                        '<div>' +
                        '   <input id="' + urlTxtId + '" type="text" style="width:300px;"/>' + 
                        '   <button id="' + btnId + '" type="button">插入图片</button>' + 
                        '</div>'
                    ),
                    callback = function(){
                        $modal.find('#' + urlTxtId).val('');
                    };
                $modal.find('#' + btnId).click(function(e){
                    var url = $.trim($modal.find('#' + urlTxtId).val());
                    if(!url){
                        url = document.getElementById(urlTxtId).value;
                    }
                    if(url !== ''){
                        commonCommand(e, 'insertImage', url, callback);
                    }
                });

                return $modal;
            })()
        },
        'split',
        {
            'title': '撤销',
            'type': 'btn',
            'txt': 'fa fa-undo',
            'command': function(e){
                document.execCommand("undo");
                e.preventDefault();
            },
            'callback': function(){
                //alert('撤销操作');
            }
        },
        {
            'title': '重复',
            'type': 'btn',
            'txt': 'fa fa-repeat',
            'command': function(e){
                document.execCommand("redo");
                e.preventDefault();
            }
        }
    ];

    /*绑定jquery插件
	* customMenus: 自定义菜单
    */
    $.fn.wangEditor = function(customMenus){
    	var height = this.height(),
    		initContent = this.html(),
            $dropMenuContainer = $('<div></div>'),
            $toolTipContainer = $('<div></div>'),
            $window = $(window);

    	//加入自定义菜单
        if(customMenus){
            menus = $.extend(menus, customMenus);
        }

    	//渲染菜单（包括下拉菜单和弹出框）
        function createMenuElem(menu){
            if(menu.toString() === 'split'){
                //分割符
                return $('<div class="split"></div>');
            }
            var type = menu.type,
                txt = menu.txt,
                txtArr,
                title = menu.title,
                command = menu.command,  //函数或者字符串
                $dropMenu = menu.dropMenu,
                $modal = menu.modal,
                callback = menu.callback,
                $btn = $('<a class="btn btn-default" href="#"></a>');  //一定要有 herf='#'，否则无法监听blur事件
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
                        commonCommand(e, command, undefined, callback);
                    });
                }
                //自定义命令（command是函数）
                if(typeof command === 'function'){
                    $btn.click(function(e){
                        command(e);  //如果command是函数，则直接执行command
                    });
                }
            }
            //下拉菜单
            else if(type === 'dropMenu'){
                $btn.addClass('btn-drop');
                $btn.append($('<i class="fa fa-angle-down"></i>'));

                //渲染下拉菜单
                $dropMenu.attr('class', 'drop-menu');
                $dropMenuContainer.append($dropMenu);
                function hideDropMenu(){
                    $dropMenu.hide();
                }
                $btn.click(function(e){
                    var btnTop = $btn.offset().top,
                        btnLeft = $btn.offset().left,
                        btnHeight = $btn.height();
                    $dropMenu.css({
                        'top': (btnTop + btnHeight + 5) + 'px',
                        'left': btnLeft + 'px'
                    });
                    $dropMenu.show();
                    e.preventDefault();
                }).blur(function(e){
                    setTimeout(hideDropMenu, 100);  //先执行完，再隐藏
                });

                //命令（使用事件代理）
                $dropMenu.on('click', 'a[commandValue]', function(e){
                    var $this = $(this),
                        value = $this.attr('commandValue');
                    commonCommand(e, command, value);
                });
            }
            //弹出框
            else if(type === 'modal'){
                //渲染modal
                $modal.attr('class', 'modal modal-small');
                $modal.prepend($(
                    '<div class="header">' + 
                        '<a href="#" class="close"><i class="fa fa-close"></i></a>' + 
                        '<b>' + title + '</b>' + 
                        '<div class="clear-both"></div>' + 
                        '<div class="line"></div>' + 
                    '</div>'
                ));
                $modalContainer.append($modal);
                $btn.click(function(e){
                    var windowWidth = $window.width(),
                        windowHeight = $window.height(),
                        modalWidth = $modal.width(),
                        modalHeight = $modal.height();
                    $maskDiv.width(windowWidth);
                    $maskDiv.height(windowHeight);
                    $modal.css({
                        'top': '100px',
                        'left': (windowWidth - modalWidth)/2 + 'px'
                    });

                    $maskDiv.show();
                    $modal.show();
                    e.preventDefault();
                });
                $modal.find('.close').click(function(e){
                    $maskDiv.hide();
                    $modal.hide();
                    e.preventDefault();
                });
            }

            //添加tooltips效果
            if(title){
                $btn.attr('title', '');

                var btnTop,
                    btnLeft,
                    btnWidth,
                    $toolTip = $('<div class="toolTip"></div>'),
                    $toolTipContent = $('<div class="content">' + title + '</div>'),
                    $toolTipFooter = $('<div class="footer"><i class="fa fa-caret-down"></i></div>'),
                    toolTipHeight,
                    toolTipWidth,
                    toolTipTop,
                    toolTipLeft,
                    timer;
                $toolTip.append($toolTipContent)
                        .append($toolTipFooter);
                $toolTipContainer.append($toolTip);

                function showToolTip(){
                    $toolTip.show();
                }
                $btn.mouseenter(function(){
                    btnTop = $btn.offset().top;
                    btnLeft = $btn.offset().left;
                    btnWidth = $btn.width();
                    toolTipHeight = $toolTip.height();
                    toolTipWidth = $toolTip.width();
                    toolTipTop = btnTop - toolTipHeight + 5;
                    toolTipLeft = btnLeft - (toolTipWidth-btnWidth)/2 + 3;
                    $toolTip.css({
                        'top': toolTipTop + 'px',
                        'left': toolTipLeft + 'px'
                    });
                    timer = setTimeout(showToolTip, 200);  //0.2s之后才显示tooltip，防止鼠标快速经过时会闪烁
                }).mouseleave(function(){
                    clearTimeout(timer);
                    $toolTip.hide();
                });
            }

            return $btn;
        }
        $.each(menus, function(){
            var $menu = createMenuElem(this);
            $btnContainer.append($menu);
        });
        $btnContainer.append($('<div class="clear-both"></div>'))
                      .append($('<div class="line"></div>'));

    	//$txt光标发生变化时，保存selection，更新menu style
        $txt.on('focus click keyup', function(e){
            var keyForMoveCursor = false,
                kCodes = ' 33, 34, 35, 36, 37, 38, 39, 40, 8, 46 ';
            keyForMoveCursor = ( e.type === 'click' || e.type === 'focus' || (e.type === 'keyup' && kCodes.indexOf(e.keyCode) !== -1) );
            if (!keyForMoveCursor) {
                return;  //只监听click,focus和[33, 34, 35, 36, 37, 38, 39, 40, 8, 46]这几个键，其他的不监听
            }
            saveSelection();
            updateMenuStyle();
        });

    	//插入 $menu 和 $txt  （$txt已经在开头定义）
        this.attr('class', 'wangEditor');
    	this.html('')
            .append($toolTipContainer)
            .append($maskDiv)
            .append($dropMenuContainer)
            .append($modalContainer)
    		.append($btnContainer)
    		.append($txt);
    	$txt.html(initContent);
    	height = height - $btnContainer.height() - 11;
    	height = height >= 50 ? height : defaultHeight;
    	$txt.height(height);

    	return $txt;
    };

})(window);