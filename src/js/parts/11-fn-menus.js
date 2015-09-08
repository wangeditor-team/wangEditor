
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
            btnId = $E.getUniqeId(),
            content = '<p>请输入代码：</p>' +
                        '<div><textarea id="' + txtId + '" style="width:100%; height:100px;"></textarea></div>' + 
                        '<button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">插入</button>',
            $simpleCode_modal = $(
                $E.htmlTemplates.modal.replace('{content}', content)
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
                code = $E.htmlTemplates.codePre.replace('{content}', code);
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
    'command': 'commonUndo'
},
'redo': {
    'title': '重复',
    'type': 'btn',
    'cssClass': 'icon-wangEditor-cw',
    'command': 'commonRedo'
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