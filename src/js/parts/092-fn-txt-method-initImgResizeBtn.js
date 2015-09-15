$.extend($E.fn, {
	//初始化img右下角的resize按钮
    'initImgResizeBtn': function(selectExpression){
        var editor = this,
            $resizeBtn = editor.$imgResizeBtn,
            focusIdNow,  //当前focus元素的id——$elem.data('imgResizeId')
            isResizeBtnMoving = false;  //是否正在移动？

        //隐藏rezie按钮
        function hideResizeBtn(){
            if(isResizeBtnMoving){
                return;
            }

            //隐藏按钮
            var resizeBtnDisplay = $resizeBtn.css('display');
            if( resizeBtnDisplay !== '' && resizeBtnDisplay !== 'none' ){
                $resizeBtn.hide();
            }
            //清空 focusIdNow
            focusIdNow = '';
        }

        //绑定img的click事件（显示resize按钮）
        editor.$txt.on('click', selectExpression, function(e){
            var $elem = $(this),
                elemId = $elem.data('imgResizeId'),
                uniqueId = $E.getUniqeId();

            if(elemId && focusIdNow === elemId){
                e.stopPropagation(); //阻止冒泡，不能让 editor.$txt 监控到click事件
                return; //如果当前元素已经被focus，resize按钮此时已经显示了，则无需再重新显示resize按钮
            }else{
                //如果当前元素没有被focus，则把focusIdNow赋值成该元素的Id
                if(!elemId){
                    $elem.data('imgResizeId', uniqueId);
                    elemId = uniqueId;
                }
                focusIdNow = elemId;
            }

            var elemPosition = $elem.position(),
                elemTop = elemPosition.top,
                elemLeft = elemPosition.left,
                elemWidth = $elem.outerWidth(),
                elemHeight = $elem.outerHeight(),

                txtContainerPosition = editor.$txtContainer.position(),
                txtContainerTop = txtContainerPosition.top,
                txtContainerLeft = txtContainerPosition.left,
                txtContainerWidth = editor.$txtContainer.outerWidth(),
                txtContainerHeight = editor.$txtContainer.outerHeight(),

                btnWidth = $resizeBtn.outerWidth(),
                btnHeight = $resizeBtn.outerHeight(),

                //$resizebtn 拖拽相关的变量
                editorContainerPostion = editor.$editorContainer.position(),
                editorContainerLeft = editorContainerPostion.left,
                editorContainerTop = editorContainerPostion.top,
                resizeBtnWidth,
                resizeBtnHeight,
                _x,
                _y;

            if(elemTop + elemHeight > txtContainerTop + txtContainerHeight){
                //元素底部已经被txtContainer覆盖
                return;
            }
            if(elemLeft + elemWidth > txtContainerLeft + txtContainerWidth){
                //元素右边已经被txtContainer覆盖
                return;
            }

            //定位resizeBtn，并显示出来
            $resizeBtn.css({
                'top': (elemTop + elemHeight - btnHeight) + 'px',
                'left': (elemLeft + elemWidth - btnWidth) + 'px'
            });
            $resizeBtn.show();

            //滚动时隐藏
            editor.$txtContainer.off('scroll.resizebtn');
            editor.$txtContainer.on('scroll.resizebtn', hideResizeBtn);

            //设置resizebtn事件
            $resizeBtn.off();
            $resizeBtn.on('mousedown', function(e){
                //开始移动的标记
                isResizeBtnMoving = true;

                //计算鼠标离 resizeBtn 左上角的相对位置 
                var resizeBtnPostion = $resizeBtn.position();
                _x = e.pageX - editorContainerLeft - resizeBtnPostion.left;
                _y = e.pageY - editorContainerTop - resizeBtnPostion.top;

                //记录 $resizeBtn 的长度宽度
                resizeBtnWidth = $resizeBtn.outerWidth();
                resizeBtnHeight = $resizeBtn.outerHeight();
            });
            $document.off('mousemove.resizeBtn mouseup.resizeBtn');
            $document.on('mousemove.resizeBtn', function(e){
                if(isResizeBtnMoving){
                    //计算，鼠标离 editorContainer 左上角的相对位置
                    var x = e.pageX - editorContainerLeft - _x,
                        y = e.pageY - editorContainerTop - _y;
                    $resizeBtn.css({
                        'top': y,
                        'left': x
                    });

                    //获取 $resizeBtn 最新的位置
                    var resizeBtnPostion = $resizeBtn.position(),
                        resizeBtnLeft = resizeBtnPostion.left,
                        resizeBtnTop = resizeBtnPostion.top;
                    $elem.css({
                        'width': resizeBtnLeft + resizeBtnWidth - elemLeft,
                        'height': resizeBtnTop + resizeBtnHeight - elemTop
                    });

                    e.preventDefault();
                }
            }).on('mouseup.resizeBtn', function(e){
                //移动结束的标记
                isResizeBtnMoving = false;
            });

            //阻止冒泡，不能让 editor.$txt 监控到click事件
            e.stopPropagation();  
            e.preventDefault();
        });
        //隐藏resizeBtn按钮
        editor.$txt.on('click keyup blur', function(e){
            if(e.type === 'blur'){
                setTimeout(hideResizeBtn, 100); //预留0.1毫秒，等待 $resizeBtn.mousedown 执行
            }else{
                hideResizeBtn();
            }
        });
    }
});