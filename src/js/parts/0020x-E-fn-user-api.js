// 暴露给用户的 API
_e(function (E, $) {

    // 创建编辑器
    E.fn.create = function () {
        var editor = this;

        // 检查 E.$body 是否有值
        // 如果在 body 之前引用了 js 文件，body 尚未加载，可能没有值
        if (!E.$body || E.$body.length === 0) {
            E.$body = $('body');
            E.$document = $(document);
            E.$window = $(window);
        }

        // 执行 addMenus 之前：
        // 1. 允许用户修改 editor.UI 自定义配置UI
        // 2. 允许用户通过修改 editor.menus 来自定义配置菜单
        // 因此要在 create 时执行，而不是 init           
        editor.addMenus();

        // 渲染
        editor.renderMenus();
        editor.renderMenuContainer();
        editor.renderTxt();
        editor.renderEditorContainer();

        // 绑定事件
        editor.eventMenus();
        editor.eventMenuContainer();
        editor.eventTxt();

        // 处理ready事件
        editor.readyHeadler();

        // 初始化选区
        editor.initSelection();

        // $txt 快捷方式
        editor.$txt = editor.txt.$txt;

        // 执行用户自定义事件，通过 E.ready() 添加
        var _plugins = E._plugins;
        if (_plugins && _plugins.length) {
            $.each(_plugins, function (k, val) {
                val.call(editor);
            });
        }
    };

    // 禁用编辑器
    E.fn.disable = function () {
        this.txt.$txt.removeAttr('contenteditable');
        this.disableMenusExcept();

        // 先禁用，再记录状态
        this._disabled = true;
    };
    // 启用编辑器
    E.fn.enable = function () {
        // 先解除状态记录，再启用
        this._disabled = false;
        this.txt.$txt.attr('contenteditable', 'true');
        this.enableMenusExcept();
    };

    // 销毁编辑器
    E.fn.destroy = function () {
        var self = this;
        var $valueContainer = self.$valueContainer;
        var $editorContainer = self.$editorContainer;
        var valueNodeName = self.valueNodeName;

        if (valueNodeName === 'div') {
            // div 生成的编辑器
            $valueContainer.removeAttr('contenteditable');
            $editorContainer.after($valueContainer);
            $editorContainer.hide();
        } else {
            // textarea 生成的编辑器
            $valueContainer.show();
            $editorContainer.hide();
        }
    };

    // 撤销 销毁编辑器
    E.fn.undestroy = function () {
        var self = this;
        var $valueContainer = self.$valueContainer;
        var $editorContainer = self.$editorContainer;
        var $menuContainer = self.menuContainer.$menuContainer;
        var valueNodeName = self.valueNodeName;

        if (valueNodeName === 'div') {
            // div 生成的编辑器
            $valueContainer.attr('contenteditable', 'true');
            $menuContainer.after($valueContainer);
            $editorContainer.show();
        } else {
            // textarea 生成的编辑器
            $valueContainer.hide();
            $editorContainer.show();
        }
    };

    // 清空内容的快捷方式
    E.fn.clear = function () {
        var editor = this;
        var $txt = editor.txt.$txt;
        $txt.html('<p><br></p>');
        editor.restoreSelectionByElem($txt.find('p').get(0));
    };

});