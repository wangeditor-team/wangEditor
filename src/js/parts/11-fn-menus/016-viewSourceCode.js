'viewSourceCode': {
    'title': langMenus.viewSourceCode.title,
    'type': 'modal',
    'cssClass': 'wangeditor-menu-img-code',
    'modal': function(editor){
        var txtId = $E.getUniqeId(),
            btnId = $E.getUniqeId();

        var langUpdate = langCommon.update;

        var content = '<div><textarea style="width:100%; height:200px;" id="' + txtId + '"></textarea></div>' +
                        '<button id="' + btnId + '" class="wangEditor-modal-btn"  type="button">' +langUpdate+ '</button>';
        var $sourceCode_modal = $(
                $E.htmlTemplates.modalBig.replace('{content}', content)
            );
        var triggerClass = this.cssClass;

        //显示源码
        $(function(){
            editor.$btnContainer.find('.' + triggerClass) //找到<i>
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

            // 过滤掉js代码
            if (editor.filterJs) {
                sourceCode = sourceCode.replace(/<script[\s\S]*?<\/script>/ig, '');
            }

            if( $.trim(sourceCode) === '' ){
                sourceCode = '<p><br></p>';
            }
            editor.command(e, 'replaceSourceCode', sourceCode);
        });

        return $sourceCode_modal;
    }
},