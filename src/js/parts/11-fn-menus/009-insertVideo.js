'insertVideo': {
    'title': langMenus.insertVideo.title,
    'type': 'modal',
    'cssClass': 'wangeditor-menu-img-play',
    'modal': function(editor){
        var txtSrcId = $E.getUniqeId(),
            txtWidthId = $E.getUniqeId(),
            txtHeightId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            defaultWidth = 480, defaultHeight = 400;

        var langModal = langMenus.insertVideo.modal,
            langUrl = langModal.url,
            langWidth = langModal.width,
            langHeight = langModal.height,

            langBtn = langCommon.insert,

            langUnsafe = langCommon.unsafeAlert,
            langFormatError = langCommon.formatError;

        var content = '<p>' +langUrl+ '：<input id="' + txtSrcId + '" type="text" style="width:300px;"  placeholder="*.swf, *.mp4, *.ogg, *.webm"/></p>' +
                        '<p>' +langWidth+ '：<input id="' + txtWidthId + '" type="text" style="width:50px" value="' + defaultWidth + '"/> px（像素）</p>' +
                        '<p>' +langHeight+ '：<input id="' + txtHeightId + '" type="text" style="width:50px" value="' + defaultHeight + '"/> px（像素） </p>' +
                        '<p><button id="' + btnId + '" class="wangEditor-modal-btn" type="button">' +langBtn+ '</button></p>';
        var $video_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );

        //插入视频点击事件
        $video_modal.find('#' + btnId).click(function(e){
            var src = $.trim( $('#' + txtSrcId).val() ), 
                width = +( $('#' + txtWidthId).val() ),
                height = +( $('#' + txtHeightId).val() ),
                reg = /^\s*(http:\/\/|https:\/\/).+(\.swf|\.ogg|\.mp4|\.webm)/i,
                html,
                video_callback = function(){
                    $('#' + txtSrcId).val('');
                    $('#' + txtWidthId).val(defaultWidth);
                    $('#' + txtHeightId).val(defaultHeight);
                };

            //验证src的合法性
            if($E.filterXSSForUrl(src) === false){
                alert( langUnsafe );
                return;
            }

            //在此验证src
            if(!reg.test(src)){
                alert( langFormatError );
                return;
            }

            //验证高度和宽度的合法性，不合法则使用默认配置
            if(isNaN(width)){
                width = defaultWidth;
            }
            if(isNaN(height)){
                height = defaultHeight;
            }

            if ((/.swf/i).test(src) === true) {
                // swf 格式
                html = $E.htmlTemplates.videoEmbed
                        .replace(/#{vedioUrl}/ig, src)
                        .replace(/#{width}/ig, width)
                        .replace(/#{height}/ig, height);
            } else {
                // 其他格式，如ogg mp4 webm
                html = $E.htmlTemplates.videoH5
                        .replace(/#{vedioUrl}/ig, src)
                        .replace(/#{width}/ig, width)
                        .replace(/#{height}/ig, height);
            }
            
            editor.command(e, 'insertHTML', html, video_callback);
        });

        return $video_modal;
    }
},