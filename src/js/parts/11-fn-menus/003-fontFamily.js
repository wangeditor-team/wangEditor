'fontFamily': {
    'title': langMenus.fontFamily.title,
    'type': 'dropMenu',
    'cssClass': 'icon-wangEditor-font2',
    'command': 'fontName ', 
    'dropMenu': function(){
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<li><a href="#" commandValue="${value}" style="font-family:${family};">${txt}</a></li>',
            $ul;

        $.each($E.styleConfig.fontFamilyOptions, function(key, value){
            arr.push(
                temp.replace('${value}', value)
                    .replace('${family}', value)
                    .replace('${txt}', value)
            );
        });
        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    },
    'callback': function(editor){
        //console.log(editor);
    }
},