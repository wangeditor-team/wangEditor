// img 菜单
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'img';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.img
        });

        // 创建 panel content
        var $panelContent = $('<div class="panel-tab"></div>');
        var $tabContainer = $('<div class="tab-container"></div>');
        var $contentContainer = $('<div class="content-container"></div>');
        $panelContent.append($tabContainer).append($contentContainer);

        // tab
        var $uploadTab = $('<a href="#">' + lang.uploadImg + '</a>');
        var $linkTab = $('<a href="#">' + lang.linkImg + '</a>');
        $tabContainer.append($uploadTab).append($linkTab);

        // 上传图片 content
        var $uploadContent = $('<div class="content"></div>');
        $contentContainer.append($uploadContent);

        // 网络图片 content
        var $linkContent = $('<div class="content"></div>');
        $contentContainer.append($linkContent);
        linkContentHandler(editor, menu, $linkContent);

        // 添加panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $panelContent,
            width: 400,
            onRender: function () {
                // 渲染后的回调事件，用于执行自定义上传的init
                // 因为渲染之后，上传面板的dom才会被渲染到页面，才能让第三方空间获取到
                var init = editor.config.customUploadInit;
                init && init.call(editor);
            }
        });

        // 增加到editor对象中
        editor.menus[menuId] = menu;

        // tab 切换事件
        function tabToggle() {
            $uploadTab.click(function (e) {
                $tabContainer.children().removeClass('selected');
                $contentContainer.children().removeClass('selected');
                $uploadContent.addClass('selected');
                $uploadTab.addClass('selected');
                e.preventDefault();
            });
            $linkTab.click(function (e) {
                $tabContainer.children().removeClass('selected');
                $contentContainer.children().removeClass('selected');
                $linkContent.addClass('selected');
                $linkTab.addClass('selected');
                e.preventDefault();

                // focus input
                if (E.placeholder) {
                    $linkContent.find('input[type=text]').focus();
                }
            });

            // 默认情况
            // $uploadTab.addClass('selected');
            // $uploadContent.addClass('selected');
            $uploadTab.click();
        }

        // 隐藏上传图片
        function hideUploadImg() {
            $tabContainer.remove();
            $uploadContent.remove();
            $linkContent.addClass('selected');
        }

        // 隐藏网络图片
        function hideLinkImg() {
            $tabContainer.remove();
            $linkContent.remove();
            $uploadContent.addClass('selected');
        }

        // 判断用户是否配置了上传图片
        editor.ready(function () {
            var editor = this;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var customUpload = config.customUpload;
            var linkImg = config.hideLinkImg;
            var $uploadImgPanel;

            if (uploadImgUrl || customUpload) {
                // 第一，暴露出 $uploadContent 以便用户自定义 ！！！重要
                editor.$uploadContent = $uploadContent;

                // 第二，绑定tab切换事件
                tabToggle();

                if (linkImg) {
                    // 隐藏网络图片
                    hideLinkImg();
                }
            } else {
                // 未配置上传图片功能
                hideUploadImg();
            }

            // 点击 $uploadContent 立即隐藏 dropPanel
            // 为了兼容IE8、9的上传，因为IE8、9使用 modal 上传
            // 这里使用异步，为了不妨碍高级浏览器通过点击 $uploadContent 选择文件
            function hidePanel() {
                menu.dropPanel.hide();
            }
            $uploadContent.click(function () {
                setTimeout(hidePanel);
            });
        });
    });

    // --------------- 处理网络图片content ---------------
    function linkContentHandler (editor, menu, $linkContent) {
        var lang = editor.config.lang;
        var $urlContainer = $('<div style="margin:20px 10px 10px 10px;"></div>');
        var $urlInput = $('<input type="text" class="block" placeholder="http://"/>');
        $urlContainer.append($urlInput);
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

        $linkContent.append($urlContainer).append($btnSubmit).append($btnCancel);

        // 取消
        $btnCancel.click(function (e) {
            e.preventDefault();
            menu.dropPanel.hide();
        });

        // callback 
        function callback() {
            $urlInput.val('');
        }

        // 确定
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var url = $.trim($urlInput.val());
            if (!url) {
                // 无内容
                $urlInput.focus();
                return;
            }

            var imgHtml = '<img style="max-width:100%;" src="' + url + '"/>';
            editor.command(e, 'insertHtml', imgHtml, callback);
        });
    }

});