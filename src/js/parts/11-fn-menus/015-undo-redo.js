'undo': {
    'title': '撤销',
    'type': 'btn',
    'hotKey': 'ctrl+z',  //例如'ctrl+z'/'ctrl,shift+z'/'ctrl,shift,alt+z'/'ctrl,shift,alt,meta+z'，支持这四种情况。只有type==='btn'的情况下，才可以使用快捷键
    'cssClass': 'icon-wangEditor-ccw',
    'command': 'commonUndo'
},
'redo': {
    'title': '重复',
    'type': 'btn',
    'cssClass': 'icon-wangEditor-cw',
    'command': 'commonRedo'
},