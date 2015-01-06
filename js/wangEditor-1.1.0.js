/*
* wangEditor 1.1.0
* 王福朋
* 2015-01-06
*/
(function (window, undefined) {
	//验证jQuery
    if (!window.jQuery) {
        return;
    }
    var document = window.document,
		$ = window.jQuery,

		supportRange = typeof document.createRange === 'function',
        currentRange, parentElem,   //记录当前选中范围，及公共父元素

	    menus,  //存储菜单配置
        defaultMenuConfig, //默认的菜单显示配置
		
        $txt = $('<div class="wangEditor-textarea" ></div>'),  //编辑区
        $btnContainer = $('<div class="wangEditor-btn-container"></div>'), //菜单容器
        $maskDiv = $('<div class="wangEditor-mask"></div>'),  //遮罩层
        $modalContainer = $('<div></div>'),  //modal容器
        $allMenusWithCommandName,

        commandHooks, //自定义命令
        commandRecords = [], //命令记录
        commandRecordCursor = -1, //命令记录中的当前游标位置
        comandRecordMaxLength = 20, //最大长度

        idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
        id = 1,

        basicConfig;  //基本配置（字体、颜色、字号）

    //获取唯一ID
    function getUniqeId () {
        return idPrefix + (id++);
    }
    if(!window.wangEditor_getUniqeId){
        //暴露给全局使用
        window.wangEditor_getUniqeId = getUniqeId;
    }

    //--------------------基本配置--------------------
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

    //--------------------菜单配置--------------------
    //默认的菜单显示配置
    defaultMenuConfig = [
                            'fontFamily', 'fontSize', '|', 
                            'bold', 'underline', 'italic', '|', 
                            'foreColor', 'backgroundColor', 'removeFormat', '|', 
                            'unOrderedList', 'orderedList', '|', 
                            'justifyLeft', 'justifyCenter', 'justifyRight', '|', 
                            'createLink', 'unLink', '|', 
                            'insertHr', 'insertTable', 'webImage', '|', 
                            'undo', 'redo'
                        ];
    //菜单配置集
    menus = {
        'fontFamily': {
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
        'fontSize': {
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
        'bold': {
            'title': '加粗',
            'type': 'btn',
            'hotKey': 'ctrl + b',
            'txt':'fa fa-bold',
            'command': 'bold',
            'callback': function(){
                //alert('自定义callback函数');
            }
        },
        'underline': {
            'title': '下划线',
            'type': 'btn',
            'hotKey': 'ctrl + u',
            'txt':'fa fa-underline',
            'command': 'underline '
        },
        'italic': {
            'title': '斜体',
            'type': 'btn',
            'hotKey': 'ctrl + i',
            'txt':'fa fa-italic',
            'command': 'italic '
        },
        'foreColor': {
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
        'backgroundColor': {
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
        'removeFormat': {
            'title': '清除格式',
            'type': 'btn',
            'txt':'fa fa-eraser',
            'command': 'RemoveFormat ' 
        },
        'unOrderedList': {
            'title': '无序列表',
            'type': 'btn',
            'txt':'fa fa-list-ul',
            'command': 'InsertUnorderedList '
        },
        'orderedList': {
            'title': '有序列表',
            'type': 'btn',
            'txt':'fa fa-list-ol',
            'command': 'InsertOrderedList '
        },
        'justifyLeft': {
            'title': '左对齐',
            'type': 'btn',
            'txt':'fa fa-align-left',
            'command': 'JustifyLeft '   
        },
        'justifyCenter': {
            'title': '居中',
            'type': 'btn',
            'txt':'fa fa-align-center',
            'command': 'JustifyCenter'  
        },
        'justifyRight': {
            'title': '右对齐',
            'type': 'btn',
            'txt':'fa fa-align-right',
            'command': 'JustifyRight ' 
        },
        'createLink': {
            'title': '插入链接',
            'type': 'modal-small',   //可以使用 'modal-big'/'modal'/'modal-small'/'modal-mini'
            'txt': 'fa fa-link',
            'modal': (function () {
                var urlTxtId = getUniqeId(),
                    titleTxtId = getUniqeId(),
                    blankCheckId = getUniqeId(),
                    btnId = getUniqeId();
                    $modal = $(
                        '<div>' +
                        '   链接：<input id="' + urlTxtId + '" type="text" style="width:300px;"/><br />' +
                        '   标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/><br />' + 
                        '   新窗口：<input id="' + blankCheckId + '" type="checkbox" checked="checked"/><br />' +
                        '   <button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入链接</button>' + 
                        '</div>'
                    ),
                    callback = function(){
                        $modal.find('input').val('');
                    };
                $modal.find('#' + btnId).click(function(e){
                    var url = $.trim($modal.find('#' + urlTxtId).val()),
                        title = $.trim($modal.find('#' + titleTxtId).val()),
                        isBlank = $modal.find('#' + blankCheckId).is(':checked');
                    if(!url){
                        //for IE6
                        url = $.trim(document.getElementById(urlTxtId).value);  
                        title = $.trim(document.getElementById(titleTxtId).value);
                    }

                    if(url !== ''){
                        //xss过滤
                        if(xssFilter(url) === false){
                            alert('您的输入内容有不安全字符，请重新输入！')
                            return;
                        }
                        if(title === '' && !isBlank){
                            commonCommand(e, 'createLink', url, callback);
                        }else{
                            commonCommand(e, 'customCreateLink', {'url':url, 'title':title, 'isBlank':isBlank}, callback);
                        }
                    }
                });

                return $modal;
            })()
        },
        'unLink': {
            'title': '取消链接',
            'type': 'btn',
            'txt':'fa fa-unlink',
            'command': 'unLink ' 
        },
        'insertHr': {
            'title': '插入横线',
            'type': 'btn',
            'txt':'fa fa-minus',
            'command': 'InsertHorizontalRule ' 
        },
        'insertTable': {
            'title': '插入表格',
            'type': 'modal-small',
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
                        '   显示标题行：<input id="' + titleCheckId + '" type="checkbox" checked="checked"/>' + 
                        '   &nbsp;&nbsp;&nbsp;&nbsp;' +
                        '   <button id="' + btnId + '" class="wangEditor-modal-btn">插入表格</button>',
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
                        tableTemp = '<table border="1" bordercolor="#cccccc" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" > ${content} </table>',
                        trArray = [],
                        firstTrTemp = '<tr style="font-weight:bold;background-color:#f1f1f1;">${content}</tr>',
                        trTemp = '<tr>${content}</tr>',
                        tdArray = [],
                        tdTemp = '<td style="width:100px;">&nbsp;</td>';
                    
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
        'webImage': {
            'title': '网络图片',
            'type': 'modal-small',
            'txt': 'fa fa-image',
            'modal': (function () {
                var urlTxtId = getUniqeId(),
                    titleTxtId = getUniqeId(),
                    btnId = getUniqeId();
                    $modal = $(
                        '<div>' +
                        '   网址：<input id="' + urlTxtId + '" type="text" style="width:300px;"/><br/>' +
                        '   标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/><br/>' +
                        '   <button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入图片</button>' + 
                        '</div>'
                    ),
                    callback = function(){
                        $modal.find('input').val('');
                    };
                $modal.find('#' + btnId).click(function(e){
                    var url = $.trim($modal.find('#' + urlTxtId).val()),
                        title = $.trim($modal.find('#' + titleTxtId).val());
                    if(!url){
                        //for IE6
                        url = $.trim(document.getElementById(urlTxtId).value); 
                        title = $.trim(document.getElementById(title).value); 
                    }
                    if(url !== ''){
                        //xss过滤
                        if(xssFilter(url) === false){
                            alert('您的输入内容有不安全字符，请重新输入！')
                            return;
                        }
                        if(title === ''){
                            commonCommand(e, 'insertImage', url, callback);
                        }else{
                            commonCommand(e, 'customeInsertImage', {'url':url, 'title':title}, callback);
                        }
                    }
                });

                return $modal;
            })()
        },
        'undo': {
            'title': '撤销',
            'type': 'btn',
            'hotKey': 'ctrl+z',  //例如'ctrl+z'/'ctrl,shift+z'/'ctrl,shift,alt+z'/'ctrl,shift,alt,meta+z'，支持这四种情况。只有type==='btn'的情况下，才可以使用快捷键
            'txt': 'fa fa-undo',
            'command': function(e){
                undo();
                e.preventDefault();
            }
        },
        'redo': {
            'title': '重复',
            'type': 'btn',
            'txt': 'fa fa-repeat',
            'command': function(e){
                redo();
                e.preventDefault();
            }
        }
    };
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
                $btn.addClass('wangEditor-btn-container-btn-selected');
            }else{
                $btn.removeClass('wangEditor-btn-container-btn-selected');
            }
        });
    }

	//--------------------selection range 相关事件--------------------
    function getCurrentRange() {
        var selection,
            range,
            _parentElem,
            txt = $txt[0];
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
            parentElem = _parentElem;
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

    //--------------------命令相关事件--------------------
    //初始化
    function _initCommandRecord(){
        var txt = $txt.html();
        commandRecords = [];
        commandRecords.push(txt);
        commandRecordCursor = 0;
    }
    //记录新执行的命令
    function addCommandRecord(){
        var length = commandRecords.length,
            txt = $txt.html();
        if(length > 0){
            if(txt === commandRecords[commandRecordCursor]){
                return;  //当前文字和记录中游标位置的文字一样，则不再记录
            }
        }
        //记录txt
        commandRecords.push(txt);

        if(length >= comandRecordMaxLength){
            commandRecords.shift();
        }

        //记录游标
        length = commandRecords.length;
        commandRecordCursor = length - 1;
    }
    //撤销
    function undo(){
        if(commandRecordCursor > 0){
            commandRecordCursor = commandRecordCursor - 1;
            $txt.html( commandRecords[commandRecordCursor] );
        }
    }
    //重做
    function redo(){
        var length = commandRecords.length;
        if(commandRecordCursor < length - 1){
            commandRecordCursor = commandRecordCursor + 1;
            $txt.html( commandRecords[commandRecordCursor] );
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
    //xss过滤
    function xssFilter(url){
        url = $.trim(url.toLowerCase());
        if(url.indexOf('javascript:') === 0){
            return false;
        }
        return true;
    }
    //命令 hook
    commandHooks = {
        //插入html，for IE
        'insertHTML': function(commandName, commandValue){
            var $elem;
            if(!currentRange){
                return;
            }
            $elem = getElemForInsertTable($(parentElem));
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
                $parentElem,
                id = getUniqeId(),
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
            newLinks.attr('title', title);
            newLinks.attr('target', '_blank');

            //去掉上文对a的标记
            if(oldLinks.length > 0){
                oldLinks.removeAttr(id);
            }
        },
        //自定义插入image，包含title，alt
        'customeInsertImage': function(commandName, commandValue){
            var url = commandValue['url'],
                title = commandValue['title'],
                $parentElem,
                id = getUniqeId(),
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
        //删除 $table
        'delete$elem': function(commandName, commandValue){
            commandValue.remove();  //即：$table.remove();
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
        if(!currentRange){
            if(e){
                e.preventDefault();
            }
            return;
        }

        var commandHook;

        //恢复选中区
        restoreSelection();

        //执行
        if(commandEnabled(commandName) === true){
            document.execCommand(commandName, false, commandValue);
        }else{
            commandHook = commandHooks[commandName];
            if(commandHook){
                commandHook(commandName, commandValue);
            }
        }

        //重新保存，否则chrome，360，safari，opera中会清空currentRange
        saveSelection();
        
        //执行回调函数
        if(callback){
            callback.call($txt);
        }

        //更新菜单样式
        updateMenuStyle();

        //关闭modal
        $modalContainer.find('.wangEditor-modal:visible').hide();
        if($maskDiv.is(':visible')){
            $maskDiv.hide();
        }

        //记录，以便撤销
        addCommandRecord();

        if(e){
            e.preventDefault();
        }
    }
    if(!window.wangeditor_commonCommand){
        //暴露给全局使用
        window.wangeditor_commonCommand = commonCommand;
    }

    //--------------------生成插件--------------------
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
    $.fn.wangEditor = function(options){
        /*
        * options: {
        *   customMenus: {       //自定义添加的菜单
        *       'menuId1': {...},
        *       'menuId2': {...}
        *   },
        *   insertBefore: {     //在某个菜单前面插入一个菜单
        *       'currentMenuId1': 'insertMenuId1' / ['...','...','...'] ,
        *       'currentMenuId2': 'insertMenuId2 / ['...','...','...']'
        *   },
        *   after: {   //在某个菜单后面追加一个菜单
        *       'currentMenuId1': 'afterMenuId1' / ['...','...','...'],
        *       'currentMenuId2': 'afterMenuId2' / ['...','...','...']
        *   },
        *   hideMenuConfig: [...],  //配置要隐藏的菜单
        *   menuConfig: [...]   //配置要显示的菜单（menuConfig会覆盖掉 insertBefore 和 hideMenuConfig）
        * }
        */
    	var options = options || {},
            customMenus = options.customMenus, //自定义添加的菜单
            insertBefore = options.insertBefore, 
            after = options.after,
            hideMenuConfig = options.hideMenuConfig,
            menuConfig,

            txtHeight = this.height(),
    		initContent = this.html(),
            $dropMenuContainer = $('<div></div>'),
            $toolTipContainer = $('<div></div>'),
            $window = $(window),
            $tableDeleteBtn = $('<a href="#" class="wangEditor-tableDeleteBtn"><i class="fa fa-close"></i></a>'),  //删除table,img的按钮
            tableDeleteBtnDisabled;  //当前是否显示

    	//------------------加入自定义菜单------------------
        if(customMenus){
            //将customMenus中的menuId加入到defaultMenuConfig
            $.each(customMenus, function(key){
                defaultMenuConfig.push(key);
            });

            //传入的将customeMenus合并到menus
            menus = $.extend(menus, customMenus);
        }

        //------------------配置要显示的菜单------------------
        if(options.menuConfig){
            //如果传入了 menuConfig 则以menuConfig为主，忽略掉 insertBefore，after 和 hideMenuConfig
            menuConfig = options.menuConfig; 
        }else{
            //如果未传入 menuConfig ，则默认为defaultMenuConfig，考虑 insertBefore，after 和 hideMenuConfig
            menuConfig = defaultMenuConfig;

            if(insertBefore){
                //前面插入
                $.each(insertBefore, function(key, value){
                    // key: 现有的menuId
                    // value: 要插入的menuId 或数组
                    var index = menuConfig.indexOf($.trim(key));
                    if(index !== -1){
                        if(typeof value === 'string'){
                            value = [value];
                        }
                        //将默认追加的customMenuId，从menuConfig中删除
                        $.each(value, function(key, value){
                            value = $.trim(value);
                            if(value === '|'){
                                return;
                            }

                            var index = menuConfig.lastIndexOf(value);
                            if(index !== -1){
                                menuConfig[index] = null;
                            }
                        });

                        value.unshift(0);
                        value.unshift(index);
                        Array.prototype.splice.apply(menuConfig, value);
                    }
                });
            }

            if(after){
                //后面追加
                $.each(after, function(key, value){
                    // key: 现有的menuId，
                    // value: 要插入的menuId 或数组
                    var index = menuConfig.indexOf($.trim(key));
                    if(typeof value === 'string'){
                        value = [value];
                    }

                    //将默认追加的customMenuId，从menuConfig中删除
                    $.each(value, function(key, value){
                        value = $.trim(value);
                        if(value === '|'){
                            return;
                        }

                        var index = menuConfig.lastIndexOf($.trim(value));
                        if(index !== -1){
                            menuConfig[index] = null;
                        }
                    });

                    if(index + 1 === menuConfig.length){
                        Array.prototype.push.apply(menuConfig, value);
                    }else{
                        value.unshift(0);
                        value.unshift(index + 1);
                        Array.prototype.splice.apply(menuConfig, value);
                    }
                });
            }

            if(hideMenuConfig){
                //隐藏
                $.each(hideMenuConfig, function(){
                    var elem = $.trim(this),
                        index = menuConfig.indexOf(elem);
                    if(index !== -1){
                        menuConfig[index] = null;
                    }
                });
            }
        }

    	//------------------渲染菜单（包括下拉菜单和弹出框）------------------
        function createMenuElem(menu){
            if(menu.toString() === '|'){
                //分割符
                return $('<div class="wangEditor-btn-container-split"></div>');
            }
            var type = menu.type,
                txt = menu.txt,
                txtArr,
                title = menu.title,
                command = menu.command,  //函数或者字符串
                hotKey = menu.hotKey, //快捷键
                fnKeys = [],
                keyCode,
                $dropMenu = menu.dropMenu,
                $modal = menu.modal,
                callback = menu.callback,
                $btn = $('<a class="wangEditor-btn-container-btn wangEditor-btn-container-btn-default" href="#"></a>');  //一定要有 herf='#'，否则无法监听blur事件
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
                    $txt.on('keydown', function(e){
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
                $btn.append($('<i class="fa fa-angle-down"></i>'));

                //渲染下拉菜单
                $dropMenu.attr('class', 'wangEditor-drop-menu');
                $dropMenuContainer.append($dropMenu);
                function hideDropMenu(){
                    $dropMenu.hide();
                }
                $btn.click(function(e){
                    var btnTop = $btn.position().top,
                        btnLeft = $btn.position().left,
                        btnHeight = $btn.height();
                    $dropMenu.css({
                        'top': (btnTop + btnHeight + 5) + 'px',
                        'left': btnLeft + 'px'
                    });
                    $dropMenu.show();
                    e.preventDefault();
                    this.focus();  //for 360急速浏览器
                }).blur(function(e){
                    setTimeout(hideDropMenu, 100);  //先执行完，再隐藏
                });

                //命令（使用事件代理）
                $dropMenu.on('click', 'a[commandValue]', function(e){
                    var $this = $(this),
                        value = $this.attr('commandValue');
                    commonCommand(e, command, value);
                });

                $dropMenu.hide();
            }
            //弹出框
            else if(type.indexOf('modal') === 0){
                //渲染modal
                if(type === 'modal'){
                    type = ''; //type可能为 'modal', 'modal-big', 'modal-small', 'modal-mini'
                }
                $modal.attr('class', 'wangEditor-modal wangEditor-'+ type);  
                $modal.prepend($(
                    '<div class="wangEditor-modal-header">' + 
                        '<a href="#" commandName="close" class="wangEditor-modal-header-close"><i class="fa fa-close"></i></a>' + 
                        '<b>' + title + '</b>' + 
                        '<div class="wangEditor-clear-both"></div>' + 
                        '<div class="wangEditor-modal-header-line"></div>' + 
                    '</div>'
                ));
                $modalContainer.append($modal);
                $btn.click(function(e){
                    var windowWidth = $window.width(),
                        windowHeight = $window.height(),
                        modalWidth = $modal.width(),
                        btnContainerTop = $btnContainer.position().top,
                        btnContainerHeight = $btnContainer.height();
                    $maskDiv.width(windowWidth);
                    $maskDiv.height(windowHeight);
                    $modal.css({
                        'top': (btnContainerTop + btnContainerHeight) + 'px',
                        'left': (windowWidth - modalWidth)/2 + 'px'
                    });

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

            //添加tooltips效果
            if(title){
                $btn.attr('title', '');
                if(hotKey){
                    title = title + '('  + hotKey + ')';  //加入快捷键提示
                }

                var btnTop,
                    btnLeft,
                    btnWidth,
                    $toolTip = $('<div class="wangEditor-toolTip"></div>'),
                    $toolTipContent = $('<div class="wangEditor-toolTip-content">' + title + '</div>'),
                    $toolTipFooter = $('<div class="wangEditor-toolTip-footer"><i class="fa fa-caret-down"></i></div>'),
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
                    btnTop = $btn.position().top;
                    btnLeft = $btn.position().left;
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
        $.each(menuConfig, function(){
            if(this == null){
                return;
            }
            var title = $.trim(this),
                menu,
                $btn;
            if(title === '|'){
                menu = '|';
            }else{
                menu = menus[title];
            }
            if(menu){
                $btn = createMenuElem(menu);
                $btnContainer.append($btn);
            }
        });
        $btnContainer.append($('<div class="wangEditor-clear-both"></div>'))
                      .append($('<div class="wangEditor-btn-container-line"></div>'));

    	//------------------$txt监听------------------
        function txtListener(e){
            saveSelection();
            updateMenuStyle();

            if(e && e.type === 'focus'){
                //focus只能执行一次监听——页面一加载时$txt被强制执行focus()，而剩下的监听都会由click和keyup代替
                $txt.off('focus', txtListener);
            }
        }
        $txt.on('focus', txtListener)
        .on('mousedown', function(){
            //当鼠标按下时，可能会拖拽选择，这就有可能拖拽到$txt外面再松开，需要监控
            $txt.on('mouseleave', function(){
                //鼠标拖拽到外面再松开的
                $txt.off('mouseleave'); 
                setTimeout(txtListener, 100);  //缓0.1s，否则鼠标移动太快的话，选不全
            });
        }).on('click keyup', function(e){
            var keyForMoveCursor = false,
                kCodes = [33, 34, 35, 36, 37, 38, 39, 40, 13, 8, 46, 9];
            keyForMoveCursor = ( e.type === 'click' || (e.type === 'keyup' && (kCodes.indexOf(e.keyCode) !== -1) || e.ctrlKey || e.shiftKey) );
            if (!keyForMoveCursor) {
                return;  //只监听click, 和 kCodes 中的这几个键，其他的不监听
            }
            txtListener();

            if(e.type === 'click'){
                //鼠标未被按住拖拽到外面再松开，而是在$txt里面就松开了
                $txt.off('mouseleave');
            }
        }).on('focus blur', function(){
            //focus blur 时记录，以便撤销
            addCommandRecord();
        });

        //------------------显示删除table,img的按钮------------------
        tableDeleteBtnDisabled = false;
        function hideTableDeleteBtn(){
            if(tableDeleteBtnDisabled){
                $tableDeleteBtn.hide();
                tableDeleteBtnDisabled = false;
            }
        }
        $txt.on('click', 'table,img', function(){
            var $elem = $(this),
                txtTop = $txt.position().top,
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
            $txt.off('scroll');
            $txt.on('scroll', hideTableDeleteBtn);

            //点击btn，删除
            $tableDeleteBtn.off();
            $tableDeleteBtn.click(function(e){
                //统一用commonCommand删除，方便撤销
                commonCommand(e, 'delete$elem', $elem, hideTableDeleteBtn);  
            });
        });
        $txt.on('keyup blur', function(){
            setTimeout(hideTableDeleteBtn, 100); //预留0.1毫秒，等待 $tableDeleteBtn.click 执行
        });

    	//------------------插入 $btnContainer ， $txt 等 ------------------
        this.attr('class', 'wangEditor');
    	this.html('')
            .append($tableDeleteBtn)
            .append($toolTipContainer)
            .append($maskDiv)
            .append($dropMenuContainer)
            .append($modalContainer)
    		.append($btnContainer)
    		.append($txt);
    	$txt.html(initContent);
    	txtHeight = txtHeight - $btnContainer.height() - 12;
    	txtHeight = txtHeight >= 50 ? txtHeight : 100;
    	$txt.height(txtHeight);

        //------------------初始化时记录，以便撤销------------------
        _initCommandRecord();

        //------------------最后返回 $txt------------------
        $txt.attr('contenteditable', true)
        //$txt.focus();
    	return $txt;
    };
})(window);