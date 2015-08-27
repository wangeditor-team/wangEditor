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