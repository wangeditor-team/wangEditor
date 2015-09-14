'undo': {
    'title': langMenus.undo.title,
    'type': 'btn',
    'hotKey': 'ctrl+z',  //例如'ctrl+z'/'ctrl,shift+z'/'ctrl,shift,alt+z'/'ctrl,shift,alt,meta+z'，支持这四种情况。只有type==='btn'的情况下，才可以使用快捷键
    'cssClass': 'icon-wangEditor-ccw',
    'command': 'commonUndo',
    'callback': function(editor){
    	//撤销时，会发生光标不准确的问题
    	//因此，撤销时，让编辑器失去焦点
    	editor.blur();
    }
},
'redo': {
    'title': langMenus.redo.title,
    'type': 'btn',
    'cssClass': 'icon-wangEditor-cw',
    'command': 'commonRedo',
    'callback': function(editor){
    	//redo时，会发生光标不准确的问题
    	//因此，redo时，让编辑器失去焦点
    	editor.blur();
    }
},