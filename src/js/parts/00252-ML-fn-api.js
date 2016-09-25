// modal fn api
_e(function (E, $) {

    var Modal = E.Modal;

    // 渲染
    Modal.fn._render = function () {
        var self = this;
        var editor = self.editor;
        var $modal = self.$modal;

        // $modal的z-index，在配置的z-index基础上再 +10
        $modal.css('z-index', editor.config.zindex + 10 + '');

        // 渲染到body最后面
        E.$body.append($modal);

        // 记录状态
        self.rendered = true;
    };

    // 定位
    Modal.fn._position = function () {
        var self = this;
        var $modal = self.$modal;
        var top = $modal.offset().top;
        var width = $modal.outerWidth();
        var height = $modal.outerHeight();
        var marginLeft = 0 - (width / 2);
        var marginTop = 0 - (height / 2);
        var sTop = E.$window.scrollTop();

        // 保证modal最顶部，不超过浏览器上边框
        if ((height / 2) > top) {
            marginTop = 0 - top;
        }

        $modal.css({
            'margin-left': marginLeft + 'px',
            'margin-top': (marginTop + sTop) + 'px'
        });
    };

    // 显示
    Modal.fn.show = function () {
        var self = this;
        var menu = self.menu;
        if (!self.rendered) {
            // 第一次show之前，先渲染
            self._render();
        }

        if (self.isShowing) {
            return;
        }
        // 记录状态
        self.isShowing = true;

        var $modal = self.$modal;
        $modal.show();

        // 定位
        self._position();

        // 激活菜单状态
        menu && menu.activeStyle(true);
    };

    // 隐藏
    Modal.fn.hide = function () {
        var self = this;
        var menu = self.menu;
        if (!self.isShowing) {
            return;
        }
        // 记录状态
        self.isShowing = false;

        // 隐藏
        var $modal = self.$modal;
        $modal.hide();

        // 菜单状态
        menu && menu.activeStyle(false);
    };
});