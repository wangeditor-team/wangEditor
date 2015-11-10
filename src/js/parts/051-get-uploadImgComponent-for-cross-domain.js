$.extend($E, {
	'getUploadImgComponentForCrossDomain': function(editor){
		var uploadUrl = editor.uploadUrl,
	        fileInputName = 'wangEditor_uploadImg',  //服务器端根据这个name获取file
	        imgExts = '|.bmp|.jpg|.jpeg|.png|.gif|';  //图片文件的后缀名（注意：前后都要加“|”）

	    var formId = $E.getUniqeId(),
	        fileId = $E.getUniqeId(),
	        titleTxtId = $E.getUniqeId(),
	        btnId = $E.getUniqeId(),
	        infoId = $E.getUniqeId(),
	        iframeId = $E.getUniqeId();

	    //配置多语言
	    var langConfig = editor.langConfig,
	    	langIsertImage = langConfig.menus.insertImage,

	    	langModal = langIsertImage.modal,
	    	langChoose = langModal.choose,
	    	langTitle = langModal.title,

	    	langAlert = langIsertImage.alert,
	    	langChooseAImage = langAlert.chooseAImage,
	    	langFileTypeError = langAlert.fileTypeError,
	    	langUploading = langAlert.uploading,

	    	langUpload = langConfig.common.upload;

	    var content =   '<form id="' + formId + '" method="post" enctype="multipart/form-data" target="' + iframeId + '">'+
	                    '   <p>' +langChoose+ '：<input type="file" accept="image/*" name="' + fileInputName + '" id="' + fileId + '"/></p>' +
	                    '   <p>' +langTitle+ '：<input type="text" id="' + titleTxtId + '" style="width:250px;"/></p>' +
	                    '   <p><button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">' +langUpload+ '</button></p>' +
	                    '   <span stype="color:red;" id="' + infoId + '"></span>' +
	                    '</form>' +
	                    '<div style="display:none;"><iframe id="' + iframeId + '" name="' + iframeId + '" style="display:none; width:0; height:0;"></iframe></div>',
	        $uploadImg_modal = $( content );
	    
	    $uploadImg_modal.find('#' + btnId).click(function(e){
	        //检验是否传入uploadUrl配置
	        if(uploadUrl == null || typeof uploadUrl !== 'string'){
	            alert('未配置URL地址，不能上传图片');  
	            //该提示给测试人员，而非让用户看到，因此不用多语言
	            return;
	        }

	        //检验是否选择文件
	        var fileVal = $('#' + fileId).val();
	        if(fileVal === ''){
	            alert( langChooseAImage );
	            return;
	        }

	        //检验后缀名是否是图片
	        var ext = fileVal.slice( fileVal.lastIndexOf('.') - fileVal.length );
	        ext = '|' + ext.toLowerCase() + '|';
	        if(imgExts.indexOf(ext) === -1){
	            alert( langFileTypeError );
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
	        $info.html( langUploading );

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
});