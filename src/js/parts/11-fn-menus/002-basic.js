'bold': {
    'title': langMenus.bold.title,
    'type': 'btn',
    'hotKey': 'ctrl + b',
    'beforeFn': function(editor){
        //alert('点击按钮之后立即出发的事件，此时还未触发command');
        //console.log(editor);
    },
    'cssClass':'wangeditor-menu-img-bold',
    'command': 'bold',
    'callback': function(editor){
        //console.log(editor);
    }
},
'underline': {
    'title': langMenus.underline.title,
    'type': 'btn',
    'hotKey': 'ctrl + u',
    'cssClass':'wangeditor-menu-img-underline',
    'command': 'underline '
},
'italic': {
    'title': langMenus.italic.title,
    'type': 'btn',
    'hotKey': 'ctrl + i',
    'cssClass':'wangeditor-menu-img-italic',
    'command': 'italic '
},
'removeFormat': {
    'title': langMenus.removeFormat.title,
    'type': 'btn',
    'cssClass':'wangeditor-menu-img-eraser',
    'command': 'RemoveFormat ' 
},
// 'indent': {
//     'title': langMenus.indent.title,
//     'type': 'btn',
//     'hotKey': 'ctrl,shift + i',
//     'cssClass':'wangeditor-menu-img-indent-right',
//     'command': 'indent'
// },
// 'outdent': {
//     'title': langMenus.outdent.title,
//     'type': 'btn',
//     'cssClass':'wangeditor-menu-img-indent-left',
//     'command': 'outdent'
// }, 
'unLink': {
    'title': langMenus.unLink.title,
    'type': 'btn',
    'cssClass':'wangeditor-menu-img-unlink',
    'command': 'unLink ' 
},
'insertHr': {
    'title': langMenus.insertHr.title,
    'type': 'btn',
    'cssClass':'wangeditor-menu-img-minus',
    'command': 'InsertHorizontalRule' 
},
'strikethrough':{
    'title': langMenus.strikethrough.title,
    'type': 'btn',
    'cssClass':'wangeditor-menu-img-strikethrough',
    'command': 'StrikeThrough'
},
'blockquote': {
    'title': langMenus.blockquote.title,
    'type': 'btn',
    'cssClass':'wangeditor-menu-img-quotes-left',
    'command': 'formatBlock',
    'commandValue': 'blockquote',
    'callback': function(editor){
        //获取所有的引用块
        var $blockquotes = editor.$txt.find('blockquote'),
            key = 'hadStyle';

        //遍历所有引用块，设置样式
        $.each($blockquotes, function(index, value){
            var $quote = $(value),
                data = $quote.data(key),  //获取 key 的值
                $next,
                style;

            if(data){
                //如果通过 key 获取的有值，说明它已经有样式了
                //可以不再重复操作
                return;
            }

            //获取下一个elem
            $next = $quote.next();

            //获取当前的 style ，或者初始化为空字符串
            style = $quote.attr('style') || '';
            
            //拼接新的 style
            style = $E.styleConfig.blockQuoteStyle + style;

            //重新赋值
            $quote.attr('style', style);

            //最后，做标记
            $quote.data(key, true);

            //如果后面再也没有元素，给加一个空行。否则新生成的引用无法删除
            if('length' in $next && $next.length === 0){
                $quote.after('<p><br></p>');
            }
        });
    }
},