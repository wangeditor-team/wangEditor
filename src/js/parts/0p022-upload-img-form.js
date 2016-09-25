// form方式上传图片
_e(function (E, $) {

    if (window.FileReader && window.FormData) {
        // 如果支持 html5 上传，则返回
        return;
    }
    
    // 构造函数
    var UploadFile = function (opt) {
        this.editor = opt.editor;
        this.uploadUrl = opt.uploadUrl;
        this.timeout = opt.timeout;
        this.fileAccept = opt.fileAccept;
        this.multiple = false;
    };

    UploadFile.fn = UploadFile.prototype;

    // clear
    UploadFile.fn.clear = function () {
        this.$input.val('');
        E.log('input value 已清空');
    };

    // 隐藏modal
    UploadFile.fn.hideModal = function () {
        this.modal.hide();
    };

    // 渲染
    UploadFile.fn.render = function () {
        var self = this;
        var editor = self.editor;
        var uploadFileName = editor.config.uploadImgFileName || 'wangEditorFormFile';
        if (self._hasRender) {
            // 不要重复渲染
            return;
        }

        // 服务器端路径
        var uploadUrl = self.uploadUrl;

        E.log('渲染dom');

        // 创建 form 和 iframe
        var iframeId = 'iframe' + E.random();
        var $iframe = $('<iframe name="' + iframeId + '" id="' + iframeId + '" frameborder="0" width="0" height="0"></iframe>');
        var multiple = self.multiple;
        var multipleTpl = multiple ? 'multiple="multiple"' : '';
        var $p = $('<p>选择图片并上传</p>');
        var $input = $('<input type="file" ' + multipleTpl + ' name="' + uploadFileName + '"/>');
        var $btn = $('<input type="submit" value="上传"/>');
        var $form = $('<form enctype="multipart/form-data" method="post" action="' + uploadUrl + '" target="' + iframeId + '"></form>');
        var $container = $('<div style="margin:10px 20px;"></div>');

        $form.append($p).append($input).append($btn);

        // 增加用户配置的参数，如 token
        $.each(editor.config.uploadParams, function (key, value) {
            $form.append( $('<input type="hidden" name="' + key + '" value="' + value + '"/>') );
        });

        $container.append($form);
        $container.append($iframe);

        self.$input = $input;
        self.$iframe = $iframe;

        // 生成 modal
        var modal = new E.Modal(editor, undefined, {
            $content: $container
        });
        self.modal = modal;

        // 记录
        self._hasRender = true;
    };

    // 绑定 iframe load 事件
    UploadFile.fn.bindLoadEvent = function () {
        var self = this;
        if (self._hasBindLoad) {
            // 不要重复绑定
            return;
        }

        var editor = self.editor;
        var $iframe = self.$iframe;
        var iframe = $iframe.get(0);
        var iframeWindow = iframe.contentWindow;
        var onload = editor.config.uploadImgFns.onload;

        // 定义load事件
        function onloadFn() {
            var resultText = $.trim(iframeWindow.document.body.innerHTML);
            if (!resultText) {
                return;
            }

            // 获取文件名
            var fileFullName = self.$input.val();  // 结果如 C:\folder\abc.png 格式
            var fileOriginalName = fileFullName;
            if (fileFullName.lastIndexOf('\\') >= 0) {
                // 获取 abc.png 格式
                fileOriginalName = fileFullName.slice(fileFullName.lastIndexOf('\\') + 1);
                if (fileOriginalName.indexOf('.') > 0) {
                    // 获取 abc （即不带扩展名的文件名）
                    fileOriginalName = fileOriginalName.split('.')[0];
                }
            }

            // 将文件名暂存到 editor.uploadImgOriginalName ，插入图片时，可作为 alt 属性来用
            editor.uploadImgOriginalName = fileOriginalName;

            // 执行load函数，插入图片的操作，应该在load函数中执行
            onload.call(editor, resultText);

            // 清空 input 数据
            self.clear();

            // 隐藏modal
            self.hideModal();
        }

        // 绑定 load 事件
        if (iframe.attachEvent) {
            iframe.attachEvent('onload', onloadFn);
        } else {
            iframe.onload = onloadFn;
        }

        // 记录
        self._hasBindLoad = true;
    };

    UploadFile.fn.show = function () {
        var self = this;
        var modal = self.modal;

        function show() {
            modal.show();
            self.bindLoadEvent();
        }
        setTimeout(show);
    };

    // 选择
    UploadFile.fn.selectFiles = function () {
        var self = this;

        E.log('使用 form 方式上传');

        // 先渲染
        self.render();

        // 先清空
        self.clear();

        // 显示
        self.show();
    };

    // 暴露给 E
    E.UploadFile = UploadFile;

});