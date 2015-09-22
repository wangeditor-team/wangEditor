$.extend($E.fn, {
	'bindPaste': function(uploadUrl){
		var editor = this,
			$txt = editor.$txt;

		$txt.on('paste', function(e){
			var data = e.clipboardData || e.originalEvent.clipboardData,
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

				            formData.append('wangEditorPasteFile', base64);
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