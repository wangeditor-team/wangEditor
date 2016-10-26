// upload img 插件
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadTimeout = config.uploadTimeout;
        var event;

        if (!uploadImgUrl) {
            return;
        }

        // 获取editor的上传dom
        var $uploadContent = editor.$uploadContent;
        if (!$uploadContent) {
            return;
        }

        // 自定义UI，并添加到上传dom节点上
        var $uploadIcon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
        $uploadContent.append($uploadIcon);

        // ---------- 构建上传对象 ----------
        var upfile = new E.UploadFile({
            editor: editor,
            uploadUrl: uploadImgUrl,
            timeout: uploadTimeout,
            fileAccept: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'    // 只允许选择图片 
        });

        // 选择本地文件，上传
        $uploadIcon.click(function (e) {
            event = e;
            upfile.selectFiles();
        });
    });
});