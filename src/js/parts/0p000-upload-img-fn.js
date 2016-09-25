// 上传图片事件
_e(function (E, $) {

    E.plugin(function () {
        var editor = this;
        var fns = editor.config.uploadImgFns; // editor.config.uploadImgFns = {} 在config文件中定义了

        // -------- 定义load函数 --------
        fns.onload || (fns.onload = function (resultText, xhr) {
            E.log('上传结束，返回结果为 ' + resultText);

            var editor = this;
            var originalName = editor.uploadImgOriginalName || '';  // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
            var img;
            if (resultText.indexOf('error|') === 0) {
                // 提示错误
                E.warn('上传失败：' + resultText.split('|')[1]);
                alert(resultText.split('|')[1]);
            } else {
                E.log('上传成功，即将插入编辑区域，结果为：' + resultText);

                // 将结果插入编辑器
                img = document.createElement('img');
                img.onload = function () {
                    var html = '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>';
                    editor.command(null, 'insertHtml', html);

                    E.log('已插入图片，地址 ' + resultText);
                    img = null;
                };
                img.onerror = function () {
                    E.error('使用返回的结果获取图片，发生错误。请确认以下结果是否正确：' + resultText);
                    img = null;
                };
                img.src = resultText;
            }

        });

        // -------- 定义tiemout函数 --------
        fns.ontimeout || (fns.ontimeout = function (xhr) {
            E.error('上传图片超时');
            alert('上传图片超时');
        });

        // -------- 定义error函数 --------
        fns.onerror || (fns.onerror = function (xhr) {
            E.error('上传上图片发生错误');
            alert('上传上图片发生错误');
        });

    });
});