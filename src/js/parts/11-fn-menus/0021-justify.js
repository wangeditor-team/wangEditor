'justify': {
    'title': langMenus.justify.title,
    'type': 'dropMenu',
    'cssClass':'wangeditor-menu-img-align-left',
    'dropMenu': function(){
        var arr = [],
            temp = '<li><a href="#" customCommandName="${command}">${txt}</a></li>',
            $ul,

            data = [
                {
                    //左对齐
                    'commandName': 'JustifyLeft',
                    'txt': '<i class="wangeditor-menu-img-align-left"> ' + langMenus.justify.left.title + '</i>'
                },{
                    //居中
                    'commandName': 'JustifyCenter',
                    'txt': '<i class="wangeditor-menu-img-align-center"> ' + langMenus.justify.center.title + '</i>'
                },{
                    //右对齐
                    'commandName': 'JustifyRight',
                    'txt': '<i class="wangeditor-menu-img-align-right"> ' + langMenus.justify.right.title + '</i>'
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