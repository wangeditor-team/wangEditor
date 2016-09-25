// modal 构造函数
_e(function (E, $) {

    // 定义构造函数
    var Modal = function (editor, menu, opt) {
        this.editor = editor;
        this.menu = menu;
        this.$content = opt.$content;

        this.init();
    };

    Modal.fn = Modal.prototype;

    // 暴露给 E 即 window.wangEditor
    E.Modal = Modal;
});