// 全屏 菜单
_e(function (E, $) {

    // 记录全屏时的scrollTop
    var scrollTopWhenFullScreen;

    E.createMenu(function (check) {
        var menuId = 'fullscreen';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var $txt = editor.txt.$txt;
        var config = editor.config;
        var zIndexConfig = config.zindex || 10000;
        var lang = config.lang;

        var isSelected = false;
        var zIndex;

        var maxHeight;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.fullscreen
        });

        // 定义click事件
        menu.clickEvent = function (e) {
            // 增加样式
            var $editorContainer = editor.$editorContainer;
            $editorContainer.addClass('wangEditor-fullscreen');

            // （先保存当前的）再设置z-index
            zIndex = $editorContainer.css('z-index');
            $editorContainer.css('z-index', zIndexConfig);

            var $wrapper;
            var txtHeight = $txt.height();
            var txtOuterHeight = $txt.outerHeight();

            if (editor.useMaxHeight) {
                // 记录 max-height，并暂时去掉maxheight
                maxHeight = $txt.css('max-height');
                $txt.css('max-height', 'none');

                // 如果使用了maxHeight， 将$txt从它的父元素中移出来
                $wrapper = $txt.parent();
                $wrapper.after($txt);
                $wrapper.remove();
                $txt.css('overflow-y', 'auto');
            }

            // 设置高度到全屏
            var menuContainer = editor.menuContainer;
            $txt.height(
                E.$window.height() - 
                menuContainer.height() - 
                (txtOuterHeight - txtHeight)  // 去掉内边距和外边距
            );

            // 取消menuContainer的内联样式（menu吸顶时，会为 menuContainer 设置一些内联样式）
            editor.menuContainer.$menuContainer.attr('style', '');

            // 保存状态
            isSelected = true;

            // 记录编辑器是否全屏
            editor.isFullScreen = true;

            // 记录设置全屏时的高度
            scrollTopWhenFullScreen = E.$window.scrollTop();
        };

        // 定义选中状态的 click 事件
        menu.clickEventSelected = function (e) {
            // 取消样式
            var $editorContainer = editor.$editorContainer;
            $editorContainer.removeClass('wangEditor-fullscreen');
            $editorContainer.css('z-index', zIndex);

            // 还原height
            if (editor.useMaxHeight) {
                $txt.css('max-height', maxHeight);
            } else {
                // editor.valueContainerHeight 在 editor.txt.initHeight() 中事先保存了
                editor.$valueContainer.css('height', editor.valueContainerHeight);
            }

            // 重新计算高度
            editor.txt.initHeight();

            // 保存状态
            isSelected = false;

            // 记录编辑器是否全屏
            editor.isFullScreen = false;

            // 还原scrollTop
            if (scrollTopWhenFullScreen != null) {
                E.$window.scrollTop(scrollTopWhenFullScreen);
            }
        };

        // 定义选中事件
        menu.updateSelectedEvent = function (e) {
            return isSelected;
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });

});