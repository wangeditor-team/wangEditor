'insertImage': {
    'title': '图片',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-picture',
    'modal': function (editor) {
        var 
            //上传组件
            uploadImgComponent = editor.uploadImgComponent,

            webImgContainerId = $E.getUniqeId(),
            alertInfoId = $E.getUniqeId(),
            changeLinkId = $E.getUniqeId(),
            urlTxtId = $E.getUniqeId(),
            titleTxtId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content =   '<p>' +
                        '   <span id="' + alertInfoId + '">插入网络图片</span> ' +
                        '   <a href="#" id="' + changeLinkId + '"></a>' +
                        '</p>' +
                        '<div id="' + webImgContainerId + '">' +
                        '   <p>网址：<input id="' + urlTxtId + '" type="text" style="width:300px;" placeholder="http://"/></p>' +
                        '   <p>标题：<input id="' + titleTxtId + '" type="text" style="width:300px;"/></p>' +
                        '<p><button id="' + btnId + '" type="button" class="wangEditor-modal-btn">插入图片</button></p>' +
                        '</div>',
            $webimg_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );

        //处理 上传图片 和 插入网络图片 的显示与隐藏关系
        $(function(){
            var $webImgContainerId = $('#' + webImgContainerId),
                $alertInfoId = $('#' + alertInfoId),
                $changeLinkId = $('#' + changeLinkId);

            //显示本地上传，隐藏网路图片
            function showUploadImg(){
                uploadImgComponent.show();
                $webImgContainerId.hide();

                //修改提示内容
                $alertInfoId.text('上传本地图片');
                $changeLinkId.text('或插入网络图片');
            }

            //显示网络图片，隐藏本地上传
            function showWebImg(){
                uploadImgComponent.hide();
                $webImgContainerId.show();

                //修改提示内容
                $alertInfoId.text('插入网络图片');
                $changeLinkId.text('或上传本地图片');
            }
 
            if(uploadImgComponent){  
                //如果有上传组件
                //将上传组件移动到model中
                $webimg_modal.append(uploadImgComponent);
                //显示上传图片
                showUploadImg();
            }

            //切换
            $changeLinkId.click(function(e){
                var txt = $changeLinkId.text();
                if(txt.indexOf('本地') >= 0){
                    showUploadImg();
                }else{
                    showWebImg();
                }

                e.preventDefault();
            });
        });

        //添加 webImg
        $webimg_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $webimg_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var url = $.trim($('#' + urlTxtId).val()),
                title = $.trim($('#' + titleTxtId).val()),
                webimg_callback = function(){
                    //webimg callback
                    $('#' + urlTxtId).val('');
                    $('#' + titleTxtId).val('');
                };
            if(!url){
                //for IE6
                url = $.trim(document.getElementById(urlTxtId).value); 
                title = $.trim(document.getElementById(titleTxtId).value); 
            }
            if(url !== ''){
                //xss过滤
                if($E.filterXSSForUrl(url) === false){
                    alert('您的输入内容有不安全字符，请重新输入！');
                    return;
                }
                if(title === ''){
                    editor.command(e, 'insertImage', url, webimg_callback);
                }else{
                    editor.command(e, 'customeInsertImage', {'url':url, 'title':title}, webimg_callback);
                }
            }
        });

        return $webimg_modal;
    }
},