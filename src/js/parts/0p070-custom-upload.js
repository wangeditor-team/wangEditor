// 自定义上传
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var customUpload = editor.config.customUpload;
        if (!customUpload) {
            return;
        } else if (editor.config.uploadImgUrl) {
            alert('自定义上传无效，详看浏览器日志console.log');
            E.error('已经配置了 uploadImgUrl ，就不能再配置 customUpload ，两者冲突。将导致自定义上传无效。');
            return;
        }

        var $uploadContent = editor.$uploadContent;
        if (!$uploadContent) {
            E.error('自定义上传，无法获取 editor.$uploadContent');
        }

        // UI
        var $uploadIcon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
        $uploadContent.append($uploadIcon);

        // 设置id，并暴露
        var btnId = 'upload' + E.random();
        var containerId = 'upload' + E.random();
        $uploadIcon.attr('id', btnId);
        $uploadContent.attr('id', containerId);

        editor.customUploadBtnId = btnId;
        editor.customUploadContainerId = containerId;
    });

});