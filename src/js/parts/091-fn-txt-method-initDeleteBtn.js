$.extend($E.fn, {
	//初始化指定元素左上角的删除按钮
    'initDeleteBtn': function(selectExpression){
        var editor = this,
            $deleteBtn = editor.$elemDeleteBtn,
            focusIdNow;  //当前focus元素的id——$elem.data('deleteBtnId')

        //隐藏删除按钮
        function hideElemDeleteBtn(){
            //隐藏按钮
            var deleteBtnDisplay = $deleteBtn.css('display');
            if( deleteBtnDisplay !== '' && deleteBtnDisplay !== 'none' ){
                $deleteBtn.hide();
            }
            //清空 focusIdNow
            focusIdNow = '';
        }

        //为目标元素（如img、table）绑定click事件
        editor.$txt.on('click', selectExpression, function(e){
            var $elem = $(this),
                elemDeleteBtnId = $elem.data('deleteBtnId'),
                uniqueId = $E.getUniqeId();

            if(elemDeleteBtnId && focusIdNow === elemDeleteBtnId){
                e.stopPropagation(); //阻止冒泡，不能让 editor.$txt 监控到click事件
                return; //如果当前元素已经被focus，删除按钮此时已经显示了，则无需再重新显示删除按钮
            }else{
                //如果当前元素没有被focus，则把focusIdNow赋值成该元素的Id
                if(!elemDeleteBtnId){
                    $elem.data('deleteBtnId', uniqueId);
                    elemDeleteBtnId = uniqueId;
                }
                focusIdNow = elemDeleteBtnId;
            }

            var btnContainerTop = editor.$btnContainer.position().top,
                btnContainerHeight = editor.$btnContainer.outerHeight(),
                elemPostion = $elem.position(),
                elemTop = elemPostion.top,
                elemLeft = elemPostion.left,
                btnWidth = $deleteBtn.width(),
                btnHeight = $deleteBtn.height();
            if(elemTop <= btnContainerTop + btnContainerHeight){
                //说明此时$elem的上不，已经被$btnContainer覆盖了
                return;
            }
            $deleteBtn.css({
                'top': (elemTop - btnHeight/2) + 'px',
                'left': (elemLeft - btnWidth/2) + 'px'
            });
            $deleteBtn.show();

            //滚动时隐藏
            editor.$txtContainer.off('scroll.deleteBtn');
            editor.$txtContainer.on('scroll.deleteBtn', hideElemDeleteBtn);

            //点击btn，删除
            $deleteBtn.off();
            $deleteBtn.click(function(e){
                //统一用editor.command删除，方便撤销
                editor.command(e, 'delete$elem', $elem, hideElemDeleteBtn);  
            });

            //阻止冒泡，不能让 editor.$txt 监控到click事件
            e.stopPropagation(); 
            e.preventDefault();
        });
        //隐藏删除按钮
        editor.$txt.on('click keyup blur', function(e){
            if(e.type === 'blur'){
                setTimeout(hideElemDeleteBtn, 100); //预留0.1毫秒，等待 $deleteBtn.click 执行
            }else{
                hideElemDeleteBtn();
            }
        });
    }
});