'insertCode':{
    'title': langMenus.insertCode.title,
    'type': 'modal',
    'cssClass': 'wangeditor-menu-img-terminal',
    'modal': function(editor){
        var txtId = $E.getUniqeId(),
            selectId = $E.getUniqeId(),
            btnId = $E.getUniqeId();

        var langModal = langMenus.insertCode.modal,
            langTitle = langModal.title;

        var content = '<p>' +langTitle+ '：{selectLangs}</p>' +  // selectLangs 待填充语言列表下拉框
                        '<div><textarea id="' + txtId + '" style="width:100%; height:100px;"></textarea></div>' + 
                        '<button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">插入</button>',
            selectLangs = '<select id="' + selectId + '">{content}</select>',  // content 待填充语言列表
            $simpleCode_modal;

        //获取语言列表（没有则返回 false）
        var hashljs = false,  //是否有高亮插件的标记。默认false
            hljs = window.hljs,  //引用了 highlightJS 插件之后才能得到
            listLanguages = hljs && hljs.listLanguages,
            langs = typeof listLanguages === 'function' && listLanguages(),
            langsStr = '';

        if(langs && typeof langs === 'object' && langs.length){
            //确定 langs 是数组

            //循环数组，获取语言列表
            $.each(langs, function(key, lang){
                langsStr = langsStr + 
                            '<option value="' + lang + '">' + 
                                lang + 
                            '</option>';
            });

            //语言下拉菜单
            selectLangs = selectLangs.replace('{content}', langsStr); //插入语言选项
            content = content.replace('{selectLangs}', selectLangs);  //插入下拉菜单

            //标记为有高亮插件
            hashljs = true;  

        }else{
            //无高亮插件，则不显示语言下拉菜单
            content = content.replace('{selectLangs}', '');
        }

        //生成modal，填充内容
        $simpleCode_modal = $(
            $E.htmlTemplates.modal.replace('{content}', content)
        );

        //插入代码
        $simpleCode_modal.find('#' + btnId).click(function(e){
            //获取并处理代码块
            var code = $.trim($('#' + txtId).val()),
                //callback回调事件
                simpleCode_callback = function(){
                    //清空代码区域
                    $('#' + txtId).val('');

                    //高亮显示代码
                    if( hashljs ){
                        $('pre code').each(function(i, block) {
                            // hljs 上面已经定义
                            hljs.highlightBlock(block);
                        });
                    }
                };

            //获取语言
            var lang;
            if(hashljs){
                lang = $('#' + selectId).val();
            }

            if(code && code !== ''){
                //替换特殊字符
                code = code.replace(/&/gm, '&amp;')
                           .replace(/</gm, '&lt;')
                           .replace(/>/gm, '&gt;');

                           //说明：之前的代码，集成highlight时注释，暂且保留
                           // .replace(/\n/gm, '<br>')
                           // .replace(/\s{1}/gm, '&nbsp;');

                if(hashljs){
                    //高亮代码块
                    code = $E.htmlTemplates.codePreWidthHightLight
                                .replace('{lang}', lang)
                                .replace('{content}', code);
                }else{
                    //普通代码块
                    code = $E.htmlTemplates.codePre.replace('{content}', code);
                }

                editor.command(e, 'insertHTML', code, simpleCode_callback);
            }
        });

        return $simpleCode_modal;
    }
},