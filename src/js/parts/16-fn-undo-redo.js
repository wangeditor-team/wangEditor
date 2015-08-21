$.extend($E.fn, {

    '_initCommandRecord': function(){
        var editor = this,
            html = editor.html();
        editor.commandRecords = [];
        editor.commandRecords.push(html);
        editor.commandRecordCursor = 0;
    },

    'addCommandRecord': function(){
        var editor = this,
            length = editor.commandRecords.length,
            txt = editor.html();
        if(length > 0){
            if(txt === editor.commandRecords[editor.commandRecordCursor]){
                return;  //当前文字和记录中游标位置的文字一样，则不再记录
            }
        }
        //记录txt
        editor.commandRecords.push(txt);

        if(length >= comandRecordMaxLength){
            editor.commandRecords.shift();
        }

        //记录游标
        length = editor.commandRecords.length;
        editor.commandRecordCursor = length - 1;
    },

    'undo': function(){
        if(this.commandRecordCursor > 0){
            this.commandRecordCursor = this.commandRecordCursor - 1;
            this.html( this.commandRecords[this.commandRecordCursor] );
        }
    },
    
    'redo': function(){
        var editor = this,
            length = editor.commandRecords.length;
        if(editor.commandRecordCursor < length - 1){
            editor.commandRecordCursor = editor.commandRecordCursor + 1;
            editor.html( editor.commandRecords[editor.commandRecordCursor] );
        }
    }
});