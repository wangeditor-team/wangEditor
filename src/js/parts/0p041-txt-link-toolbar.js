// 编辑区域 link toolbar
_e(function (E, $) {
    E.plugin(function () {
        var editor = this;
        var lang = editor.config.lang;
        var $txt = editor.txt.$txt;

        // 当前命中的链接
        var $currentLink;

        var $toolbar = $('<div class="txt-toolbar"></div>');
        var $triangle = $('<div class="tip-triangle"></div>');
        var $triggerLink = $('<a href="#" target="_blank"><i class="wangeditor-menu-img-link"></i> ' + lang.openLink + '</a>');
        var isRendered;

        // 记录当前的显示/隐藏状态
        var isShow = false;

        var showTimeoutId, hideTimeoutId;
        var showTimeoutIdByToolbar, hideTimeoutIdByToolbar;

        // 渲染 dom
        function render() {
            if (isRendered) {
                return;
            }

            $toolbar.append($triangle)
                    .append($triggerLink);

            editor.$editorContainer.append($toolbar);

            isRendered = true;
        }

        // 定位
        function setPosition() {
            if (!$currentLink) {
                return;
            }

            var position = $currentLink.position();
            var left = position.left;
            var top = position.top;
            var height = $currentLink.height();

            // 初步计算top值
            var topResult = top + height + 5;

            // 判断 toolbar 是否超过了编辑器区域的下边界
            var menuHeight = editor.menuContainer.height();
            var txtHeight = editor.txt.$txt.outerHeight();
            if (topResult > menuHeight + txtHeight) {
                topResult = menuHeight + txtHeight + 5;
            }

            // 最终设置
            $toolbar.css({
                top: topResult,
                left: left
            });
        }

        // 显示 toolbar
        function show() {
            if (isShow) {
                return;
            }

            if (!$currentLink) {
                return;
            }

            render();

            $toolbar.show();

            // 设置链接
            var href = $currentLink.attr('href');
            $triggerLink.attr('href', href);

            // 定位
            setPosition();

            isShow = true;
        }

        // 隐藏 toolbar
        function hide() {
            if (!isShow) {
                return;
            }

            if (!$currentLink) {
                return;
            }

            $toolbar.hide();
            isShow = false;
        }

        // $txt 绑定事件
        $txt.on('mouseenter', 'a', function (e) {
            // 延时 500ms 显示toolbar
            if (showTimeoutId) {
                clearTimeout(showTimeoutId);
            }
            showTimeoutId = setTimeout(function () {
                var a = e.currentTarget;
                var $a = $(a);
                $currentLink = $a;

                var $img = $a.children('img');
                if ($img.length) {
                    // 该链接下包含一个图片

                    // 图片点击时，隐藏toolbar
                    $img.click(function (e) {
                        hide();
                    });

                    if ($img.hasClass('clicked')) {
                        // 图片还处于clicked状态，则不显示toolbar
                        return;
                    }
                }

                // 显示toolbar
                show();
            }, 500);
        }).on('mouseleave', 'a', function (e) {
            // 延时 500ms 隐藏toolbar
            if (hideTimeoutId) {
                clearTimeout(hideTimeoutId);
            }
            hideTimeoutId = setTimeout(hide, 500);
        }).on('click keydown scroll', function (e) {
            setTimeout(hide, 100);
        });
        // $toolbar 绑定事件
        $toolbar.on('mouseenter', function (e) {
            // 先中断掉 $txt.mouseleave 导致的隐藏
            if (hideTimeoutId) {
                clearTimeout(hideTimeoutId);
            }
        }).on('mouseleave', function (e) {
            // 延时 500ms 显示toolbar
            if (showTimeoutIdByToolbar) {
                clearTimeout(showTimeoutIdByToolbar);
            }
            showTimeoutIdByToolbar = setTimeout(hide, 500);
        });
    });
});