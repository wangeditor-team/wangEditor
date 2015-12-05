$.extend($E.fn, {
    'change': function(){
        var editor = this,
            html = editor.html();

        //editor.latestHtml中存储了最后一次修改之后的内容
        if(html.length !== editor.latestHtml.length || html !== editor.latestHtml){

            //替换其中的单引号、双引号
            html = $E.replaceQuotes(html);

            //强制显示table边框
            $E.showTableBorder(this.$txt);

            // img max-width
            $E.addImgMaxWidth(this.$txt);

            //将html保存到textarea
            editor.textareaVal(html);

            if(editor.onchange){
                //触发onchange事件
                editor.onchange(html);
            }

            //存储这次change后的html
            editor.latestHtml = html;
        }
    }
});