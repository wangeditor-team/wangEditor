'foreColor': {
    'title': langMenus.foreColor.title,
    'type': 'dropPanel',
    'cssClass': 'icon-wangEditor-pencil', 
    //'style': 'color:blue;',
    'command': 'foreColor',
    'dropPanel': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<a href="#" commandValue="${value}" style="background-color:${color};" title="${txt}" class="forColorItem">&nbsp;</a>',
            $panel;

        $.each($E.styleConfig.colorOptions, function(key, value){
            var floatItem = temp.replace('${value}', key)
                                .replace('${color}', key)
                                .replace('${txt}', value);
            arr.push(
                $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
            );
        });
        $panel = $( 
            $E.htmlTemplates.dropPanel.replace('{content}', arr.join('')) 
        );
        return $panel; 
    }
},
'backgroundColor': {
    'title': langMenus.backgroundColor.title,
    'type': 'dropPanel',
    'cssClass': 'icon-wangEditor-brush',  
    //'style':'color:red;',
    'command': 'backColor ',
    'dropPanel': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<a href="#" commandValue="${value}" style="background-color:${color};" title="${txt}" class="forColorItem">&nbsp;</a>',
            $panel;

        $.each($E.styleConfig.colorOptions, function(key, value){
            var floatItem =  temp.replace('${value}', key)
                                .replace('${color}', key)
                                .replace('${txt}', value);
            arr.push(
               $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
            );
        });
        $panel = $( 
            $E.htmlTemplates.dropPanel.replace('{content}', arr.join('')) 
        );
        return $panel; 
    }
},