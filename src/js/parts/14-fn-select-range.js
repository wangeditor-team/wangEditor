$.extend($E.fn, {

    //设置或读取当前选中range的父元素
    'parentElemForCurrentRange': function(pe){
        if(pe){
            this.parentElem = pe;
        }else{
            return this.parentElem;
        }
    },

    //设置或读取当前选中的range
    'currentRange': function(cr){
        if(cr){
            this.currentRangeData = cr;
        }else{
            return this.currentRangeData;
        }
    },

    //获取并保存选择区域
    'saveSelection': function(range){
        //'initSelection'方法会传range参数过来
        //页面加载时，初始化selection

        var editor = this,
            selection,
            _parentElem,
            txt = editor.$txt[0];
        //获取选中区域
        if(supportRange){
            //w3c
            if(range){
                _parentElem = range.commonAncestorContainer;
            }else{
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    range = document.getSelection().getRangeAt(0);
                    _parentElem = range.commonAncestorContainer;
                }
            }
        }else{
            //IE8-
            range = document.selection.createRange();
            if(typeof range.parentElement === 'undefined'){
                //IE6、7中，insertImage后会执行此处
                //由于找不到range.parentElement，所以干脆将_parentElem赋值为null
                _parentElem = null;
            }else{
                _parentElem = range.parentElement();
            }
        }
        //确定选中区域在$txt之内
        if( _parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ){
            //将父元素保存一下
            editor.parentElemForCurrentRange( _parentElem );

            //保存已经选中的range
            editor.currentRange(range);
        }
    },

    //恢复当前选中区域
    'restoreSelection': function(){
        var editor = this,
            currentRange = editor.currentRange(),
            selection,
            range;

        if(!currentRange){
            return;
        }
        if(supportRange){
            //w3c
            selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(currentRange);
        }else{
            //IE8-
            range = document.selection.createRange();
            try {
                // 此处，plupload上传上传图片时，IE8-会报一个『参数无效』的错误
                range.setEndPoint('EndToEnd', currentRange);
            } catch (ex) {

            }
            
            if(currentRange.text.length === 0){
                range.collapse(false);
            }else{
                range.setEndPoint('StartToStart', currentRange);
            }
            range.select();
        }
    },

    //currentRange为空时，初始化为$txt的最后一个子元素
    'initSelection': function(){
        var editor = this,
            range,
            txt = editor.$txt.get(0);

        if( editor.currentRange() ){
            //如果currentRange有值，则不用再初始化
            return;
        }

        if(supportRange){ 
            //W3C方式
            range = document.createRange();
            range.setStart(txt, 0);
            range.setEnd(txt, 0);
        }

        //将range保存
        if(range){
            editor.saveSelection(range);
        }
    },

    // 判断是否选择了内容
    'hasSelectionContent': function () {
        var editor = this,
            range = this.currentRange();

        if (supportRange) {
            if(range.endContainer === range.startContainer && range.endOffset === range.startOffset) {
                // 说明没有选中任何内容
                return false;
            }
        }
        return true;
    }
    
});