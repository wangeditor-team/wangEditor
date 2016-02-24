// 插入特殊符合，菜单插件
(function (E, $) {

    // 用 createMenu 方法创建菜单
    E.createMenu(function (check) {

        // 定义菜单id，不要和其他菜单id重复。编辑器自带的所有菜单id，可通过『参数配置-自定义菜单』一节查看
        var menuId = 'symbol';

        // check将检查菜单配置（『参数配置-自定义菜单』一节描述）中是否该菜单id，如果没有，则忽略下面的代码。
        if (!check(menuId)) {
            return;
        }

        // this 指向 editor 对象自身
        var editor = this;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,  // 编辑器对象
            id: menuId,  // 菜单id
            title: '符号', // 菜单标题

            // 正常状态和选中装下的dom对象，样式需要自定义
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-omega"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-omega"></i></a>')
        });

        // 要插入的符号（可自行添加）
        var symbols = ['∑', '√', '∫', '∏', '≠', '♂', '♀']

        // panel 内容
        var $container = $('<div></div>');
        $.each(symbols, function (k, value) {
            $container.append('<a href="#" style="display:inline-block;margin:5px;">' + value + '</a>');
        });

        // 插入符号的事件
        $container.on('click', 'a', function (e) {
            var $a = $(e.currentTarget);
            var s = $a.text();

            // 执行插入的命令
            editor.command(e, 'insertHtml', s);
        });

        // 添加panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $container,
            width: 350
        });

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });

})(window.wangEditor, window.jQuery);