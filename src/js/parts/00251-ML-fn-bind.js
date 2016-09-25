// modal fn bind
_e(function (E, $) {

    var Modal = E.Modal;

    Modal.fn.init = function () {
        var self = this;

        // 初始化dom
        self.initDom();

        // 初始化隐藏事件
        self.initHideEvent();
    };

    // 初始化dom
    Modal.fn.initDom = function () {
        var self = this;
        var $content = self.$content;
        var $modal = $('<div class="wangEditor-modal"></div>');
        var $close = $('<div class="wangEditor-modal-close"><i class="wangeditor-menu-img-cancel-circle"></i></div>');

        $modal.append($close);
        $modal.append($content);

        // 记录数据
        self.$modal = $modal;
        self.$close = $close;
    };

    // 初始化隐藏事件
    Modal.fn.initHideEvent = function () {
        var self = this;
        var $close = self.$close;
        var modal = self.$modal.get(0);

        // 点击 $close 按钮，隐藏
        $close.click(function () {
            self.hide();
        });

        // 点击其他部分，隐藏
        E.$body.on('click', function (e) {
            if (!self.isShowing) {
                return;
            }
            var trigger = e.target;

            // 获取菜单elem
            var menu = self.menu;
            var menuDom;
            if (menu) {
                if (menu.selected) {
                    menuDom = menu.$domSelected.get(0);
                } else {
                    menuDom = menu.$domNormal.get(0);
                }

                if (menuDom === trigger || $.contains(menuDom, trigger)) {
                    // 说明由本菜单点击触发的
                    return;
                }
            }

            if (modal === trigger || $.contains(modal, trigger)) {
                // 说明由本panel点击触发的
                return;
            }

            // 其他情况，隐藏 panel
            self.hide();
        });
    };
});