'fontSize': {
    'title': langMenus.fontSize.title,
    'type': 'dropMenu',
    'cssClass': 'wangeditor-menu-img-text-height',
    'command': 'fontSize',
    'dropMenu': function () {
        var arr = [],
            //注意，此处commandValue必填项，否则程序不会跟踪
            temp = '<li><a href="#" commandValue="${value}" style="font-size:${fontsize};">${txt}</a></li>',
            $ul;

        $.each($E.styleConfig.fontsizeOptions, function(key, value){
            arr.push(
                temp.replace('${value}', key)
                    .replace('${fontsize}', value)
                    .replace('${txt}', value)
            );
        });
        $ul = $( $E.htmlTemplates.dropMenu.replace('{content}', arr.join('')) );
        return $ul; 
    }
},