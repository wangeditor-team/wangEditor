// xhr 上传图片
_e(function (E, $) {

    if (!window.FileReader || !window.FormData) {
        // 如果不支持html5的文档操作，直接返回
        return;
    }

    E.plugin(function () {

        var editor = this;
        var config = editor.config;
        var uploadImgUrl = config.uploadImgUrl;
        var uploadTimeout = config.uploadTimeout;

        // 获取配置中的上传事件
        var uploadImgFns = config.uploadImgFns;
        var onload = uploadImgFns.onload;
        var ontimeout = uploadImgFns.ontimeout;
        var onerror = uploadImgFns.onerror;

        if (!uploadImgUrl) {
            return;
        }

        // -------- 将以base64的图片url数据转换为Blob --------
        function convertBase64UrlToBlob(urlData, filetype){
            //去掉url的头，并转换为byte
            var bytes = window.atob(urlData.split(',')[1]);
            
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            var i;
            for (i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {type : filetype});
        }

        // -------- 插入图片的方法 --------
        function insertImg(src, event) {
            var img = document.createElement('img');
            img.onload = function () {
                var html = '<img src="' + src + '" style="max-width:100%;"/>';
                editor.command(event, 'insertHtml', html);

                E.log('已插入图片，地址 ' + src);
                img = null;
            };
            img.onerror = function () {
                E.error('使用返回的结果获取图片，发生错误。请确认以下结果是否正确：' + src);
                img = null;
            };
            img.src = src;
        }

        // -------- onprogress 事件 --------
        function updateProgress(e) {
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total;
                editor.showUploadProgress(percentComplete * 100);
            }
        }

        // -------- xhr 上传图片 --------
        editor.xhrUploadImg = function (opt) {
            // opt 数据
            var event = opt.event;
            var fileName = opt.filename || '';
            var base64 = opt.base64;
            var fileType = opt.fileType || 'image/png'; // 无扩展名则默认使用 png
            var name = opt.name || 'wangEditor_upload_file';
            var loadfn = opt.loadfn || onload;
            var errorfn = opt.errorfn || onerror;
            var timeoutfn = opt.timeoutfn || ontimeout;

            // 上传参数（如 token）
            var params = editor.config.uploadParams || {};

            // headers
            var headers = editor.config.uploadHeaders || {};

            // 获取文件扩展名
            var fileExt = 'png';  // 默认为 png
            if (fileName.indexOf('.') > 0) {
                // 原来的文件名有扩展名
                fileExt = fileName.slice(fileName.lastIndexOf('.') - fileName.length + 1);
            } else if (fileType.indexOf('/') > 0 && fileType.split('/')[1]) {
                // 文件名没有扩展名，通过类型获取，如从 'image/png' 取 'png'
                fileExt = fileType.split('/')[1];
            }

            // ------------ begin 预览模拟上传 ------------
            if (E.isOnWebsite) {
                E.log('预览模拟上传');
                insertImg(base64, event);
                return;
            }
            // ------------ end 预览模拟上传 ------------

            // 变量声明
            var xhr = new XMLHttpRequest();
            var timeoutId;
            var src;
            var formData = new FormData();

            // 超时处理
            function timeoutCallback() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (xhr && xhr.abort) {
                    xhr.abort();
                }

                // 超时了就阻止默认行为
                event.preventDefault();

                // 执行回调函数，提示什么内容，都应该在回调函数中定义
                timeoutfn && timeoutfn.call(editor, xhr);

                // 隐藏进度条
                editor.hideUploadProgress();
            }

            xhr.onload = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // 记录文件名到 editor.uploadImgOriginalName ，插入图片时，可做 alt 属性用
                editor.uploadImgOriginalName = fileName;
                if (fileName.indexOf('.') > 0) {
                    editor.uploadImgOriginalName = fileName.split('.')[0];
                }

                // 执行load函数，任何操作，都应该在load函数中定义
                loadfn && loadfn.call(editor, xhr.responseText, xhr);

                // 隐藏进度条
                editor.hideUploadProgress();
            };
            xhr.onerror = function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // 超时了就阻止默认行为
                event.preventDefault();

                // 执行error函数，错误提示，应该在error函数中定义
                errorfn && errorfn.call(editor, xhr);

                // 隐藏进度条
                editor.hideUploadProgress();
            };
            // xhr.onprogress = updateProgress;
            xhr.upload.onprogress = updateProgress;

            // 填充数据
            formData.append(name, convertBase64UrlToBlob(base64, fileType), E.random() + '.' + fileExt);

            // 添加参数
            $.each(params, function (key, value) {
                formData.append(key, value);
            });

            // 开始上传
            xhr.open('POST', uploadImgUrl, true);
            // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  // 将参数解析成传统form的方式上传

            // 修改自定义配置的headers
            $.each(headers, function (key, value) {
                xhr.setRequestHeader(key, value);
            });

            // 跨域上传时，传cookie
            xhr.withCredentials = editor.config.withCredentials || true;

            // 发送数据
            xhr.send(formData);
            timeoutId = setTimeout(timeoutCallback, uploadTimeout);

            E.log('开始上传...并开始超时计算');
        };
    });
});