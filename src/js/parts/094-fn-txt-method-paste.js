$.extend($E.fn, {
	'bindPaste': function(uploadUrl){
		var editor = this,
			$txt = editor.$txt;

		// 将以base64的图片url数据转换为Blob
		function convertBase64UrlToBlob(urlData){
    
    		//去掉url的头，并转换为byte
		    var bytes=window.atob(urlData.split(',')[1]);
		    
		    //处理异常,将ascii码小于0的转换为大于0
		    var ab = new ArrayBuffer(bytes.length);
		    var ia = new Uint8Array(ab);
		    for (var i = 0; i < bytes.length; i++) {
		        ia[i] = bytes.charCodeAt(i);
		    }

		    return new Blob([ab], {type : 'image/png'});
		}

		$txt.on('paste', function(e){
			var data = e.clipboardData || e.originalEvent.clipboardData,
				items;

			if (data == null) {
				// 兼容IE低版本
				return;
			}

			items = data.items;

			$.each(items, function(key, value){
				if(value.type.indexOf('image') > -1){
					var file = value.getAsFile(),
						reader = new FileReader();

					//已经读取了粘贴的图片
					reader.onload = function(e){
						var base64 = e.target.result || this.result,
							src,
							xhr,
							formData;

						if(uploadUrl){
							//上传到服务器

							xhr = new XMLHttpRequest();  //只有高版本浏览器才支持粘贴，因此不用检查兼容性了
				            formData = new FormData();

				            xhr.open('POST', uploadUrl, true);
				            xhr.onload = function () {
				            	//服务器端要返回图片url地址
				            	src = xhr.responseText;
				            	//执行插入
								editor.command(e, 'insertImage', src);
				            };

				            formData.append('wangEditorPasteFile', convertBase64UrlToBlob(base64));
				            xhr.send(formData);
						}else{
							//不上传，则保存为 base64编码
							src = base64;  
							//执行插入
							editor.command(e, 'insertImage', src);
						}
					};

					//读取粘贴的文件
					reader.readAsDataURL(file);
				}
			});
		}); //bind paste end
	}
});