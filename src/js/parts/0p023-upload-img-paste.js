// upload img 插件 粘贴图片
_e(function (E, $) {
    
    E.plugin(function () {
        var editor = this;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadFileName = config.uploadImgFileName || 'wangEditorPasteFile';
        var pasteEvent;
        var $imgsBeforePaste;

        // 未配置上传图片url，则忽略
        if (!uploadImgUrl) {
            return;
        }

        // -------- 非 chrome 下，通过查找粘贴的图片的方式上传 --------
        function findPasteImgAndUpload() {
            var reg = /^data:(image\/\w+);base64/;
            var $imgs = $txt.find('img');

            E.log('粘贴后，检查到编辑器有' + $imgs.length + '个图片。开始遍历图片，试图找到刚刚粘贴过来的图片');

            $.each($imgs, function () {
                var img = this;
                var $img = $(img);
                var flag;
                var base64 = $img.attr('src');
                var type;

                // 判断当前图片是否是粘贴之前的
                $imgsBeforePaste.each(function () {
                    if (img === this) {
                        // 当前图片是粘贴之前的
                        flag = true;
                        return false;
                    }
                });

                // 当前图片是粘贴之前的，则忽略
                if (flag) {
                    return;
                }

                E.log('找到一个粘贴过来的图片');

                if (reg.test(base64)) {
                    // 得到的粘贴的图片是 base64 格式，符合要求
                    E.log('src 是 base64 格式，可以上传');
                    type = base64.match(reg)[1];
                    editor.xhrUploadImg({
                        event: pasteEvent,
                        base64: base64,
                        fileType: type,
                        name: uploadFileName
                    });
                } else {
                    E.log('src 为 ' + base64 + ' ，不是 base64 格式，暂时不支持上传');
                }

                // 最终移除原图片
                $img.remove();
            });

            E.log('遍历结束');
        }

        // 开始监控粘贴事件
        $txt.on('paste', function (e) {
            pasteEvent = e;
            var data = pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData;
            var text;
            var items;

            // -------- 试图获取剪切板中的文字，有文字的情况下，就不处理图片粘贴 --------
            if (data == null) {
                text = window.clipboardData && window.clipboardData.getData('text');
            } else {
                text = data.getData('text/plain') || data.getData('text/html');
            }
            if (text) {
                return;
            }

            items = data && data.items;
            if (items) {
                // -------- chrome 可以用 data.items 取出图片 -----
                E.log('通过 data.items 得到了数据');

                $.each(items, function (key, value) {
                    var fileType = value.type || '';
                    if(fileType.indexOf('image') < 0) {
                        // 不是图片
                        return;
                    }

                    var file = value.getAsFile();
                    var reader = new FileReader();

                    E.log('得到一个粘贴图片');

                    reader.onload = function (e) {
                        E.log('读取到粘贴的图片');

                        // 执行上传
                        var base64 = e.target.result || this.result;
                        editor.xhrUploadImg({
                            event: pasteEvent,
                            base64: base64,
                            fileType: fileType,
                            name: uploadFileName
                        });
                    };

                    //读取粘贴的文件
                    reader.readAsDataURL(file);
                });
            } else {
                // -------- 非 chrome 不能用 data.items 取图片 -----

                E.log('未从 data.items 得到数据，使用检测粘贴图片的方式');

                // 获取
                $imgsBeforePaste = $txt.find('img');
                E.log('粘贴前，检查到编辑器有' + $imgsBeforePaste.length + '个图片');

                // 异步上传找到的图片
                setTimeout(findPasteImgAndUpload, 0);
            }
        });

    });
});