// menu吸顶
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var menuFixed = editor.config.menuFixed;
        if (menuFixed === false || typeof menuFixed !== 'number') {
            // 没有配置菜单吸顶
            return;
        }
        var bodyMarginTop = parseFloat(E.$body.css('margin-top'), 10);
        if (isNaN(bodyMarginTop)) {
            bodyMarginTop = 0;
        }

        var $editorContainer = editor.$editorContainer;
        var editorTop = $editorContainer.offset().top;
        var editorHeight = $editorContainer.outerHeight();

        var $menuContainer = editor.menuContainer.$menuContainer;
        var menuCssPosition = $menuContainer.css('position');
        var menuCssTop = $menuContainer.css('top');
        var menuTop = $menuContainer.offset().top;
        var menuHeight = $menuContainer.outerHeight();
        var menuWidth = $menuContainer.width();

        //重新计算宽度
        E.$window.resize(function () {
            menuWidth = $menuContainer.width();
        });
        //编辑区高度变化
        editor.onchange = function () {
            editorHeight = $editorContainer.outerHeight();
            menuWidth = $menuContainer.width();//可能出现滚动条
            menuFixedFunc();
        };

        //这个变量未使用？
        //var $txt = editor.txt.$txt;

        E.$window.scroll(menuFixedFunc);

        function menuFixedFunc () {
            //全屏模式不支持
            if (editor.isFullScreen) {
                return;
            }

            var sTop = E.$window.scrollTop();


            // 如果 menuTop === 0 说明此前编辑器一直隐藏，后来显示出来了，要重新计算相关数据
            if (menuTop === 0) {
                menuTop = $menuContainer.offset().top;
                editorTop = $editorContainer.offset().top;
                editorHeight = $editorContainer.outerHeight();
                menuHeight = $menuContainer.outerHeight();
            }

            //菜单fixed条件由离开屏幕后（sTop >= menuTop）触发改为达到menuFixed高度时（sTop + menuFixed >= menuTop）触发
            if (sTop + menuFixed >= menuTop && sTop + menuFixed + menuHeight + 30 < editorTop + editorHeight) {
                // 吸顶
                $menuContainer.css({
                    position: 'fixed',
                    top: menuFixed
                });

                // 固定宽度
                $menuContainer.width(menuWidth);

                // 增加body margin-top
                E.$body.css({
                    'margin-top': bodyMarginTop + menuHeight
                });

                // 记录
                if (!editor._isMenufixed) {
                    editor._isMenufixed = true;
                }
            } else {
                // 取消吸顶
                $menuContainer.css({
                    position: menuCssPosition,
                    top: menuCssTop
                });

                // 取消宽度固定
                $menuContainer.css('width', '100%');

                // 还原 body margin-top
                E.$body.css({
                    'margin-top': bodyMarginTop
                });

                // 撤销记录
                if (editor._isMenufixed) {
                    editor._isMenufixed = false;
                }
            }
        }
    });

});