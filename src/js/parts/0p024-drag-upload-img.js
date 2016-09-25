// 拖拽上传图片 插件 
_e(function (E, $) {

    E.plugin(function () {

        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadFileName = config.uploadImgFileName || 'wangEditorDragFile';

        // 未配置上传图片url，则忽略
        if (!uploadImgUrl) {
            return;
        }

        // 阻止浏览器默认行为
        E.$document.on('dragleave drop dragenter dragover', function (e) {
            e.preventDefault();
        });

        // 监控 $txt drop 事件
        $txt.on('drop', function (dragEvent) {
            dragEvent.preventDefault();

            var originalEvent = dragEvent.originalEvent;
            var files = originalEvent.dataTransfer && originalEvent.dataTransfer.files;

            if (!files || !files.length) {
                return;
            }

            $.each(files, function (k, file) {
                var type = file.type;
                var name = file.name;

                if (type.indexOf('image/') < 0) {
                    // 只接收图片
                    return;
                }

                E.log('得到图片 ' + name);

                var reader = new FileReader();
                reader.onload = function (e) {
                    E.log('读取到图片 ' + name);

                    // 执行上传
                    var base64 = e.target.result || this.result;
                    editor.xhrUploadImg({
                        event: dragEvent,
                        base64: base64,
                        fileType: type,
                        name: uploadFileName
                    });
                };

                //读取粘贴的文件
                reader.readAsDataURL(file);

            });
        });
    });

});