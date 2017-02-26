// h5 方式上传图片
_e(function (E, $) {

    if (!window.FileReader || !window.FormData) {
        // 如果不支持html5的文档操作，直接返回
        return;
    }

    // 构造函数
    var UploadFile = function (opt) {
        this.editor = opt.editor;
        this.uploadUrl = opt.uploadUrl;
        this.timeout = opt.timeout;
        this.fileAccept = opt.fileAccept;
        this.multiple = true;
    };

    UploadFile.fn = UploadFile.prototype;

    // clear
    UploadFile.fn.clear = function () {
        this.$input.val('');
        E.log('input value 已清空');
    };

    // 渲染
    UploadFile.fn.render = function () {
        var self = this;
        if (self._hasRender) {
            // 不要重复渲染
            return;
        }

        E.log('渲染dom');

        var fileAccept = self.fileAccept;
        var acceptTpl = fileAccept ? 'accept="' + fileAccept + '"' : '';
        var multiple = self.multiple;
        var multipleTpl = multiple ? 'multiple="multiple"' : '';
        var $input = $('<input type="file" ' + acceptTpl + ' ' + multipleTpl + '/>');
        var $container = $('<div style="display:none;"></div>');

        $container.append($input);
        E.$body.append($container);

        // onchange 事件
        $input.on('change', function (e) {
            self.selected(e, $input.get(0));
        });

        // 记录对象数据
        self.$input = $input;

        // 记录
        self._hasRender = true;
    };

    // 选择
    UploadFile.fn.selectFiles = function () {
        var self = this;

        E.log('使用 html5 方式上传');

        // 先渲染
        self.render();

        // 选择
        E.log('选择文件');
        self.$input.click();
    };

    // 选中文件之后
    UploadFile.fn.selected = function (e, input) {
        var self = this;
        var files = input.files || [];
        if (files.length === 0) {
            return;
        }

        E.log('选中 ' + files.length + ' 个文件');

        // 遍历选中的文件，预览、上传
        $.each(files, function (key, value) {
            self.upload(value);
        });
    };

    // 上传单个文件
    UploadFile.fn.upload = function (file) {
        var self = this;
        var editor = self.editor;
        var filename = file.name || '';
        var fileType = file.type || '';
        var uploadImgFns = editor.config.uploadImgFns;
        var uploadFileName = editor.config.uploadImgFileName || 'wangEditorH5File';
        var onload = uploadImgFns.onload;
        var ontimeout = uploadImgFns.ontimeout;
        var onerror = uploadImgFns.onerror;
        var reader = new FileReader();

        if (!onload || !ontimeout || !onerror) {
            E.error('请为编辑器配置上传图片的 onload ontimeout onerror 回调事件');
            return;
        }


        E.log('开始执行 ' + filename + ' 文件的上传');

        // 清空 input 数据
        function clearInput() {
            self.clear();
        }

        // onload事件
        reader.onload = function (e) {
            E.log('已读取' + filename + '文件');

            var base64 = e.target.result || this.result;
            editor.xhrUploadImg({
                event: e,
                filename: filename,
                base64: base64,
                fileType: fileType,
                name: uploadFileName,
                loadfn: function (resultText, xhr) {
                    clearInput();
                    // 执行配置中的方法
                    var editor = this;
                    onload.call(editor, resultText, xhr);
                },
                errorfn: function (xhr) {
                    clearInput();
                    if (E.isOnWebsite) {
                        alert('wangEditor官网暂时没有服务端，因此报错。实际项目中不会发生');
                    }
                    // 执行配置中的方法
                    var editor = this;
                    onerror.call(editor, xhr);
                },
                timeoutfn: function (xhr) {
                    clearInput();
                    if (E.isOnWebsite) {
                        alert('wangEditor官网暂时没有服务端，因此超时。实际项目中不会发生');
                    }
                    // 执行配置中的方法
                    var editor = this;
                    ontimeout(editor, xhr);
                }
            });
        };

        // 开始取文件
        reader.readAsDataURL(file);
    };

    // 暴露给 E
    E.UploadFile = UploadFile;

});