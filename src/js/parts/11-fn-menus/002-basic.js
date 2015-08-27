'bold': {
    'title': '加粗',
    'type': 'btn',
    'hotKey': 'ctrl + b',
    'beforeFn': function(editor){
        //alert('点击按钮之后立即出发的事件，此时还未触发command');
        //console.log(editor);
    },
    'cssClass':'icon-wangEditor-bold',
    'command': 'bold',
    'callback': function(editor){
        //console.log(editor);
    }
},
'underline': {
    'title': '下划线',
    'type': 'btn',
    'hotKey': 'ctrl + u',
    'cssClass':'icon-wangEditor-underline',
    'command': 'underline '
},
'italic': {
    'title': '斜体',
    'type': 'btn',
    'hotKey': 'ctrl + i',
    'cssClass':'icon-wangEditor-italic',
    'command': 'italic '
},
'removeFormat': {
    'title': '清除格式',
    'type': 'btn',
    'cssClass':'icon-wangEditor-eraser',
    'command': 'RemoveFormat ' 
},
// 'indent': {
//     'title': '增加缩进',
//     'type': 'btn',
//     'hotKey': 'ctrl,shift + i',
//     'cssClass':'icon-wangEditor-indent-right',
//     'command': 'indent'
// },
// 'outdent': {
//     'title': '减少缩进',
//     'type': 'btn',
//     'cssClass':'icon-wangEditor-indent-left',
//     'command': 'outdent'
// }, 
'unLink': {
    'title': '取消链接',
    'type': 'btn',
    'cssClass':'icon-wangEditor-unlink',
    'command': 'unLink ' 
},
'insertHr': {
    'title': '插入横线',
    'type': 'btn',
    'cssClass':'icon-wangEditor-minus',
    'command': 'InsertHorizontalRule' 
},