'uploadImg':{
    'title': '上传图片',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-file-image',
    'modal': function(editor){
        var uploadUrl = editor.uploadUrl,
            fileInputName = 'wangEditor_uploadImg',  //服务器端根据这个name获取file
            imgExts = '|.bmp|.jpg|.jpeg|.png|.gif|',  //图片文件的后缀名（注意：前后都要加“|”）

            formId = $E.getUniqeId(),
            fileId = $E.getUniqeId(),
            titleTxtId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            infoId = $E.getUniqeId(),
            iframeId = $E.getUniqeId(),
            content =   '<form id="' + formId + '" method="post" enctype="multipart/form-data" target="' + iframeId + '">'+
                        '   <p>选择文件：<input type="file" name="' + fileInputName + '" id="' + fileId + '"/></p>' +
                        '   <p>图片标题：<input type="text" id="' + titleTxtId + '" style="width:250px;"/></p>' +
                        '   <p><button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">上传</button></p>' +
                        '   <span stype="color:red;" id="' + infoId + '"></span>' +
                        '</form>' +
                        '<iframe id="' + iframeId + '" name="' + iframeId + '" style="display:none;"></iframe>',
            $uploadImg_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );
        
        $uploadImg_modal.find('#' + btnId).click(function(e){
            //检验是否传入uploadUrl配置
            if(uploadUrl == null || typeof uploadUrl !== 'string'){
                alert('未配置URL地址，不能上传图片');
                return;
            }

            //检验是否选择文件
            var fileVal = $('#' + fileId).val();
            if(fileVal === ''){
                alert('请选择图片文件');
                return;
            }

            //检验后缀名是否是图片
            var ext = fileVal.slice( fileVal.lastIndexOf('.') - fileVal.length );
            ext = '|' + ext.toLowerCase() + '|';
            if(imgExts.indexOf(ext) === -1){
                alert('选择的文件不是图片格式');
                return;
            }
            
            //检验通过，开始提交...

            var $btn = $(this),
                $info = $('#' + infoId),
                $form = $('#' + formId),
                title = $('#' + titleTxtId).val(),
                iframe = document.getElementById(iframeId),
                uploadImg_callback = function(){
                    //uploadImg callback
                    $('#' + fileId).val('');
                    $('#' + titleTxtId).val('');
                };

            //定义callback事件
            window.wangEditor_uploadImgCallback = function(result){
                //提示已经开始调用
                $E.consoleLog('父页面的wangEditor_uploadImgCallback方法已经开始被调用！');

                var arr,
                    url,  //真实图片url
                    thumbnailUrl;  //缩略图url，有可能不用缩略图
                if(result.indexOf('ok|') === 0){
                    //成功
                    arr = result.split('|');

                    //获取图片url
                    url = arr[1];
                    $E.consoleLog('wangEditor_uploadImgCallback方法成功获取到图片url：' + url);

                    if(arr.length === 2){
                        //无缩略图形式
                        if(title === ''){
                            editor.command(e, 'insertImage', url, uploadImg_callback);
                        }else{
                            editor.command(e, 'customeInsertImage', {'url':url, 'title':title}, uploadImg_callback);
                        }
                    }else if(arr.length === 3){
                        //有缩略图形式
                        thumbnailUrl = arr[2];
                        $E.consoleLog('wangEditor_uploadImgCallback方法成功获取到缩略图url：' + thumbnailUrl);

                        //执行插入图片（显示缩略图，链接到真实图片）
                        editor.command(e, 'customeInsertImage', {'url':thumbnailUrl, 'link': url, 'title':title}, uploadImg_callback);
                    }else{
                        alert('hash格式错误：' + result);
                        return;
                    }

                    //提示成功插入图片
                    $E.consoleLog('wangEditor_uploadImgCallback方法已经成功插入图片，弹出框也被关闭！');
                    
                }else{
                    //失败
                    alert(result);
                }

                //用完立刻清除，防止影响其他editor
                window.wangEditor_uploadImgCallback = undefined;
            };

            //先暂时禁用按钮
            $btn.hide();
            $info.html('上传中...');

            try{
                //设置uploadUrl，提交form
                $form.attr('action', uploadUrl);
                $form.submit();
            }catch(ex){
                alert(ex.name + ':' + ex.message);
            }finally{
                //恢复按钮状态
                $btn.show();
                $info.html('');
                e.preventDefault();
            }

            return false;
        });

        return $uploadImg_modal;
    }
},