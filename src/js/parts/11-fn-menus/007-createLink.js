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