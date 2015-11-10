'createLink': {
    'title': langMenus.createLink.title,
    'type': 'modal', 
    'cssClass': 'icon-wangEditor-link',
    'modal': function (editor) {
        var urlTxtId = $E.getUniqeId(),
            titleTxtId = $E.getUniqeId(),
            blankCheckId = $E.getUniqeId(),
            btnId = $E.getUniqeId();

        var langModal = langMenus.createLink.modal,
            langLink = langModal.link,
            langTitle = langModal.title,
            langBlank = langModal.blank,
            
            langBtn = langCommon.insert,

            langUnsafe = langCommon.unsafeAlert;

        var content = '<p>' +langLink+ '：<input id="' + urlTxtId + '" type="text" style="width:300px;"  placeholder="http://"/></p>' +
                        '<p>' +langTitle+ '：<input id="' + titleTxtId + '" type="text" style="width:300px;"/></p>' + 
                        '<p>' +langBlank+ '：<input id="' + blankCheckId + '" type="checkbox" checked="checked"/></p>' +
                        '<p><button id="' + btnId + '" type="button" class="wangEditor-modal-btn">' +langBtn+ '</button></p>',
            $link_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );

        $link_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $link_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var url = $.trim($('#' + urlTxtId).val()),
                title = $.trim($('#' + titleTxtId).val()),
                isBlank = $('#' + blankCheckId).is(':checked'),
                hasSelectContent = editor.hasSelectionContent(),
                linkHtml,
                link_callback = function(){
                    //create link callback
                    $('#' + urlTxtId).val('');
                    $('#' + titleTxtId).val('');
                };

            if(url !== ''){
                //xss过滤
                if($E.filterXSSForUrl(url) === false){
                    alert( langUnsafe );
                    return;
                }
                if (hasSelectContent === false) {
                    // 如果没有选中任何内容，则将标题当做链接内容插入
                    if (title === '') {
                        // 如果没有填写标题，只能将url当做内容插入
                        title = url;
                    }
                    linkHtml = '<a href="' + url + '" target="_blank">' + title + '</a>';
                    editor.command(e, 'insertHTML', linkHtml, link_callback);
                }else if(title === '' && !isBlank){
                    editor.command(e, 'createLink', url, link_callback);
                }else{
                    editor.command(e, 'customCreateLink', {'url':url, 'title':title, 'isBlank':isBlank}, link_callback);
                }
            }
        });

        return $link_modal;
    }
},