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
                    //无须列表
                    'commandName': 'InsertUnorderedList',
                    'txt': '<i class="icon-wangEditor-list-bullet"> 无须列表</i>'
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