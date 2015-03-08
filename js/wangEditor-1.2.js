/*
* wangEditor 1.2
* 王福朋
* 2015-03-08
*/
(function (window, undefined) {
	//验证jQuery
    var $;
    if (!window.jQuery) {
        logOrAlert('请确定是否引用了jquery.js？', true);
        return;
    }else{
        $ = window.jQuery;
        if(!($().jquery)){
            logOrAlert('javascript中，“var $ = window.jQuery”取出的不是jQuery，请修正！', true);
            return;
        }
    }


    var document = window.document,

		supportRange = typeof document.createRange === 'function',
        currentRange, parentElem,   //记录当前选中范围，及公共父元素

	    menus,  //存储菜单配置
        defaultMenuConfig, //默认的菜单显示配置
		
        $txt = $('<div class="wangEditor-textarea" ></div>'),  //编辑区
        $btnContainer = $('<div class="wangEditor-btn-container"></div>'), //菜单容器
        $maskDiv = $('<div class="wangEditor-mask"></div>'),  //遮罩层
        $modalContainer = $('<div></div>'),  //modal容器
        $allMenusWithCommandName,
        $valueElem,  //要自动保存html代码的input/extarea元素id
        changeFn,   //将保存传入的change事件

        commandHooks, //自定义命令
        commandRecords = [], //命令记录
        commandRecordCursor = -1, //命令记录中的当前游标位置
        comandRecordMaxLength = 20, //最大长度

        idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
        id = 1,

        basicConfig,  //基本配置（字体、颜色、字号）

        //判断浏览器是否支持console.log
        isSupporConsoleLog = window.console && typeof window.console.log === 'function';

    //--------------------公共方法--------------------

    //console.log 或 alert 提示信息公用方法
    function logOrAlert(info, isAlert){
        /* isAlert: true/false/undefined 当浏览器不支持console.log时，是否alert信息 */
        if(isSupporConsoleLog){
            console.log(info);
        }else if(isAlert){
            alert(info);
        }
    }

    //获取唯一ID
    function getUniqeId () {
        return idPrefix + (id++);
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
                            'setHead', 'foreColor', 'backgroundColor', 'removeFormat', '|', 
                            'indent', 'outdent', '|',
                            'unOrderedList', 'orderedList', '|', 
                            'justifyLeft', 'justifyCenter', 'justifyRight', '|', 
                            'createLink', 'unLink', '|', 
                            'insertHr', 'insertTable',  'insertCode', 'webImage', '|',
                            'undo', 'redo'
                        ];
    //菜单配置集
    /*
        menus = {
            'menuId-1': {
                'title': （字符串，必须）标题,
                'type':（字符串，必须）类型，可以是 btn / dropMenu / modal(其中包含modal-big/modal/modal-small/modal-mini),
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
    menus = {
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

                $.each(basicConfig.fontFamilyOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', value)
                            .replace('${family}', value)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
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

                $.each(basicConfig.fontsizeOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${fontsize}', value)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
                return $ul; 
            }
        },
        'bold': {
            'title': '加粗',
            'type': 'btn',
            'hotKey': 'ctrl + b',
            'txt':'icon-wangEditor-bold',
            'command': 'bold',
            'callback': function(){
                //alert('自定义callback函数');
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
                var html =  '<ul>' + 
                            '   <li><a href="#" commandValue="<h1>"><h1>标题1</h1></a></li>' + 
                            '   <li><a href="#" commandValue="<h2>"><h2>标题2</h2></a></li>' + 
                            '   <li><a href="#" commandValue="<h3>"><h3>标题3</h3></a></li>' + 
                            '   <li><a href="#" commandValue="<h4>"><h4>标题4</h4></a></li>' + 
                            '   <li><a href="#" commandValue="<p>">正文</a></li>' + 
                            '</ul>';
                return $(html);
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

                $.each(basicConfig.colorOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${color}', key)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
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

                $.each(basicConfig.colorOptions, function(key, value){
                    arr.push(
                        temp.replace('${value}', key)
                            .replace('${color}', key)
                            .replace('${txt}', value)
                    );
                });
                $ul = $('<ul>' + arr.join('') + '</ul>');
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
            'type': 'modal-small',   //可以使用 'modal-big'/'modal'/'modal-small'/'modal-mini'
            'txt': 'icon-wangEditor-link',
            'modal': function () {
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
                        if(filterXSSForUrl(url) === false){
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
            'type': 'modal-small',
            'txt': 'icon-wangEditor-table',
            'modal': function(){
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
                    commonCommand(e, 'insertHTML', table, callback);
                });
                return $modal;
            }
        },
        'webImage': {
            'title': '网络图片',
            'type': 'modal-small',
            'txt': 'icon-wangEditor-picture',
            'modal': function () {
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
                        if(filterXSSForUrl(url) === false){
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
            }
        },
        'insertCode':{
            'title': '插入代码',
            'type': 'modal',
            'txt': 'icon-wangEditor-code',
            'dependence': window.wangHighLighter, //依赖于 window.wangHighLighter
            'dependenceAlert': '插入代码功能依赖于 wangHighLighter.js 插件，请检查是否引用！',
            'modal': function(){
                var langId = getUniqeId(), 
                    themeId = getUniqeId(),
                    codeId = getUniqeId(),
                    btnId = getUniqeId(),
                    wangHighLighter = window.wangHighLighter,

                    //定义modal
                    $modal = $(
                        '<div>' +
                        '   语言：<select id="' + langId + '"></select> &nbsp;&nbsp;' +
                        '   主题：<select id="' + themeId + '"></select>' +
                        '   <textarea id="' + codeId + '" style="width:100%; height:150px;"></textarea>' + 
                        '   <button id="' + btnId + '">插入</button>' +
                        '</div>'
                    ),

                    //定义callback
                    callback = function(){
                        $modal.find('textarea').val('');
                    };

                //因为下文要对语言、主题的下拉框进行绑定，所以要先将 $modal 附加到页面上，否则无法获取select节点。
                $('body').append($modal);
                    
                var $langSlt = $('#' + langId),  //获取各个dom
                    $themeSlt = $('#' + themeId),
                    $codeTxt = $('#' + codeId),
                    $btn = $('#' + btnId),

                    //获取语言、主题的数组
                    langArray = wangHighLighter.getLangArray(),
                    themeArray = wangHighLighter.getThemeArray();

                //绑定语言
                $.each(langArray, function(key, value){
                    $langSlt.append($('<option>' + value + '</option>'));
                });
                //绑定主题
                $.each(themeArray, function(key, value){
                    $themeSlt.append($('<option>' + value + '</option>'));
                });

                //版定“插入”按钮点击事件
                $btn.click(function(e){
                    var lang = $langSlt.val(),
                        theme = $themeSlt.val(),
                        code = $codeTxt.val(),
                        result;
                    //高亮代码
                    result = wangHighLighter.highLight(lang, theme, code);
                    //插入代码
                    commonCommand(e, 'insertHTML', result, callback);
                });

                //返回 $modal
                return $modal;
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
            if(commandEnabled(commandName) && document.queryCommandState(commandName)){
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

    //-----------------及时变化的监控----------------
    function changeListener(){
        var html = $txt.html();
        if($valueElem){
            //更新到 $valueElem
            $valueElem.val(html);
        }
        if(changeFn){
            //执行change函数
            changeFn(html);
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
    if(window.filterXSS && typeof window.filterXSS === 'function'){
        //如果用户引用了xss.js，xss.js提供filterXSS方法，则不再定义。（推荐用户使用xss.js）
    }else{
        //如果没有，则自己定义一个简单的filterXSS方法（内部创建，否则可能欺骗其他js插件）
        function filterXSS(txt){
            return txt;
        }
        logOrAlert('推荐您引用xss.js，详情参见github上的说明：https://github.com/wangfupeng1988/wangEditor，它将帮助您过滤一些xss攻击', false);
    }
    //专门针对url的xss验证
    function filterXSSForUrl(url){
        var s = '<a href="' + url + '"></a>';
        return filterXSS(s) === s;
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
        },
        'commonUndo': undo,
        'commonRedo': redo
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
            }else{
                logOrAlert('不支持“' + commandName + '”命令，请检查', true);
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
            $maskDiv.hide();  //关闭遮罩层
        }

        //记录，以便撤销
        addCommandRecord();

        if(e){
            e.preventDefault();
        }

        //变化监控
        changeListener();
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
        *   hideMenuConfig: [...],  //配置要隐藏的菜单
        *   menuConfig: [...],   //配置要显示的菜单（menuConfig会覆盖掉hideMenuConfig）
        *   valueElemId: '',  //配置要自动保存html代码的元素id，元素必须为input，即能设置value值
        *   change: function(){...}  //配置change事件，
        * }
        */
    	var options = options || {},
            hideMenuConfig = options.hideMenuConfig,
            menuConfig,

            containerHeight = this.height(),
            txtHeight,
    		initContent = this.html(),
            $window = $(window),
            $body = $('body'),
            $tableDeleteBtn = $('<a href="#" class="wangEditor-tableDeleteBtn"><i class="icon-wangEditor-cancel"></i></a>'),  //删除table,img的按钮
            tableDeleteBtnDisabled;  //当前是否显示（删除table,img的按钮）
        
        //----------获取自动保存html代码的input/textarea元素（或者null）--------------
        if(options.change && typeof options.change === 'function'){
            //将传入的options.change事件复制给一个全局变量
            changeFn = options.change;
        }
        if(options.valueElemId){
            //获取自动保存html代码的input/textarea元素
            $valueElem = $('#' + options.valueElemId);

            if($valueElem[0].nodeName !== 'INPUT' && $valueElem[0].nodeName !== 'TEXTAREA'){
                //如果元素不是input/textarea类型，则将 $valueElem 赋值为null
                $valueElem = null;
            }
        }

        //------------------配置要显示的菜单------------------
        if(options.menuConfig){
            //如果传入了 menuConfig 则以menuConfig为主，忽略掉hideMenuConfig
            menuConfig = options.menuConfig; 
        }else{
            //如果未传入 menuConfig ，则默认为defaultMenuConfig，考虑hideMenuConfig
            menuConfig = defaultMenuConfig;

            if(hideMenuConfig){
                //配置隐藏的菜单
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

            var title = menu.title,
                dependence = menu.dependence,
                dependenceAlert = menu.dependenceAlert,
                dependenceAlertInfo;

            //判断是否需要依赖
            if( ('dependence' in menu) && dependence == null ){
                // menu中有'dependence'这一项，但是其值是null/undefined
                // 说明依赖不存在
                dependenceAlertInfo = 'wangEditor提示：【' + title + '】菜单需要的依赖不存在，将不显示菜单！';
                if(dependenceAlert){
                    dependenceAlertInfo += '\n（' + dependenceAlert + '）';
                }
 
                //提示，返回
                logOrAlert(dependenceAlertInfo, false);
                return;
            }

            var type = menu.type,
                txt = menu.txt,
                txtArr,
                command = menu.command,  //函数或者字符串
                hotKey = menu.hotKey, //快捷键
                fnKeys = [],
                keyCode,
                $dropMenu = menu.dropMenu && menu.dropMenu(),
                $modal = menu.modal && menu.modal(),
                callback = menu.callback,
                $btn = $('<a class="wangEditor-btn-container-btn wangEditor-btn-container-btn-default" href="#"></a>'),  //一定要有 herf='#'，否则无法监听blur事件
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
                $btn.append($('<i class="icon-wangEditor-angle-down"></i>'));

                //渲染下拉菜单
                $dropMenu.attr('class', 'wangEditor-drop-menu');
                resultArray.unshift($dropMenu);

                function hideDropMenu(){
                    $dropMenu.hide();
                }
                $btn.click(function(e){
                    $dropMenu.css('display', 'inline-block');
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
                        '<a href="#" commandName="close" class="wangEditor-modal-header-close"><i class="icon-wangEditor-cancel"></i></a>' + 
                        '<b>' + title + '</b>' + 
                        '<div class="wangEditor-modal-header-line"></div>' + 
                    '</div>'
                ));
                $modalContainer.append($modal);
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

            //添加tooltips效果
            if(title){
                $btn.attr('title', '');
                if(hotKey){
                    title = title + '('  + hotKey + ')';  //加入快捷键提示
                }

                var $toolTip = $('<div class="wangEditor-toolTip"></div>'),
                    $toolTipContent = $('<div class="wangEditor-toolTip-content">' + title + '</div>'),
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

            return resultArray;  //返回数组，默认只有[$btn]
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
                btns = createMenuElem(menu);  //返回一个数组，将其中的元素依次插入 $btnContainer
                if(btns){
                    $.each(btns, function(key, value){
                        $btnContainer.append(value);
                    });
                }
            }
        });
        $btnContainer.append($('<div class="wangEditor-btn-container-line"></div>'));

    	//------------------$txt监听------------------
        function txtListener(e){
            saveSelection();   //保存选中范围
            updateMenuStyle();  //更新菜单样式

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
            .append($maskDiv)
            .append($modalContainer)
    		.append($btnContainer)
    		.append($txt);
    	$txt.html(initContent);
    	set$txtHeight();  //计算 $txt 高度，下文定义

        //------------------------ 浏览器resize时，重新计算text域的高度 ---------------------------
        function set$txtHeight(){
            txtHeight = containerHeight - $btnContainer.height() - 12;
            txtHeight = txtHeight >= 50 ? txtHeight : 100;
            $txt.height(txtHeight);
        }
        $window.resize(set$txtHeight);  //window resize时，要重新计算 $txt 高度

        //------------------初始化时记录，以便撤销------------------
        _initCommandRecord();

        //------------------最后返回 $txt------------------
        $txt.attr('contenteditable', true)
        //$txt.focus();

        //处理 overflow-y 样式
        $txt.focus(function(){
            $txt.css('overflow-y', 'scroll');
        }).blur(function(){
            $txt.css('overflow-y', 'hidden');

            //变化监控
            changeListener();
        });

    	return $txt;
    };
})(window);