// 进度条
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var menuContainer = editor.menuContainer;
        var menuHeight = menuContainer.height();
        var $editorContainer = editor.$editorContainer;
        var width = $editorContainer.width();
        var $progress = $('<div class="wangEditor-upload-progress"></div>');

        // 渲染事件
        var isRender = false;
        function render() {
            if (isRender) {
                return;
            }
            isRender = true;

            $progress.css({
                top: menuHeight + 'px'
            });
            $editorContainer.append($progress);
        }

        // ------ 显示进度 ------
        editor.showUploadProgress = function (progress) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 显示之前，先判断是否渲染
            render();

            $progress.show();
            $progress.width(progress * width / 100);
        };

        // ------ 隐藏进度条 ------
        var timeoutId;
        function hideProgress() {
            $progress.hide();
            timeoutId = null;
        }
        editor.hideUploadProgress = function (time) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            time = time || 750;
            timeoutId = setTimeout(hideProgress, time);
        };
    });
});