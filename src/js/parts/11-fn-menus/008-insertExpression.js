'insertExpression': {
    'title': langMenus.insertExpression.title,
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