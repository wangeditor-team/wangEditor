// undo 菜单
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'undo';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.undo
        });

        // click 事件
        menu.clickEvent = function (e) {
            editor.undo();
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;


        // ------------ 初始化时、enter 时、打字中断时，做记录 ------------
        // ------------ ctrl + z 是调用记录撤销，而不是使用浏览器默认的撤销 ------------
        editor.ready(function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            var timeoutId;

            // 执行undo记录
            function undo() {
                editor.undoRecord();
            }

            $txt.on('keydown', function (e) {
                var keyCode = e.keyCode;

                // 撤销 ctrl + z
                if (e.ctrlKey && keyCode === 90) {
                    editor.undo();
                    return;
                }

                if (keyCode === 13) {
                    // enter 做记录
                    undo();
                } else {
                    // keyup 之后 1s 之内不操作，则做一次记录
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(undo, 1000);
                }
            });

            // 初始化做记录
            editor.undoRecord();
        });
    });

});