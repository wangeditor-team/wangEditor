
/*
注意：该文档为合并文档，由“11-fn-menus”文件夹中的多个文件合并而成
*/

$.extend($E.fn, {
	'initMenus': function(){
		//菜单配置集
        /*
            menus = {
                'menuId-1': {
                    'title': （字符串，必须）标题,
                    'type':（字符串，必须）类型，可以是 btn / dropMenu / dropPanel / modal,
                    'cssClass': （字符串，必须）fontAwesome字体样式，例如 'fa fa-head',
                    'style': （字符串，可选）设置btn的样式
                    'hotKey':（字符串，可选）快捷键，如'ctrl + b', 'ctrl,shift + i', 'alt,meta + y'等，支持 ctrl, shift, alt, meta 四个功能键（只有type===btn才有效）,
                    'beforeFn': (函数，可选) 点击按钮之后立即出发的事件
                    'command':（字符串）document.execCommand的命令名，如'fontName'；也可以是自定义的命令名，如“撤销”、“插入表格”按钮（type===modal时，command无效）,
                    'dropMenu': （$ul，可选）type===dropMenu时，要返回一个$ul，作为下拉菜单,
                    'modal':（$div，可选）type===modal是，要返回一个$div，作为弹出框,
                    'callback':（函数，可选）回调函数,
                },
                'modaId-2':{
                    ……
                }
            }
        */
        this.menus = {