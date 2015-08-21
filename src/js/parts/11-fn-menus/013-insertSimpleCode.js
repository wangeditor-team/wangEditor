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
                code = $E.htmlTemplates.codePre.replace('{content}', code);
                editor.command(e, 'insertHTML', code, simpleCode_callback);
            }
        });

        return $simpleCode_modal;
    }
},