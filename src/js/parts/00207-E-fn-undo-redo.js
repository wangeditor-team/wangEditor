// undo redo
_e(function (E, $) {

    var length = 20;  // 缓存的最大长度
    function _getRedoList(editor) {
        if (editor._redoList == null) {
            editor._redoList = [];
        }
        return editor._redoList;
    }
    function _getUndoList(editor) {
        if (editor._undoList == null) {
            editor._undoList = [];
        }
        return editor._undoList;
    }

    // 数据处理
    function _handle(editor, data, type) {
        // var range = data.range;
        // var range2 = range.cloneRange && range.cloneRange();
        var val = data.val;
        var html = editor.txt.$txt.html();

        if(val == null) {
            return;
        }

        if (val === html) {
            if (type === 'redo') { 
                editor.redo();
                return;
            } else if (type === 'undo') {
                editor.undo();
                return;
            } else {
                return;
            }
        }

        // 保存数据
        editor.txt.$txt.html(val);
        // 更新数据到textarea（有必要的话）
        editor.updateValue();

        // onchange 事件
        if (editor.onchange && typeof editor.onchange === 'function') {
            editor.onchange.call(editor);
        }

        // ?????
        // 注释：$txt 被重新赋值之后，range会被重置，cloneRange() 也不好使
        // // 重置选区
        // if (range2) {
        //     editor.restoreSelection(range2);
        // }
    }

    // 记录
    E.fn.undoRecord = function () {
        var editor = this;
        var $txt = editor.txt.$txt;
        var val = $txt.html();
        var undoList = _getUndoList(editor);
        var redoList = _getRedoList(editor);
        var currentVal = undoList.length ? undoList[0] : '';

        if (val === currentVal.val) {
            return;
        }

        // 清空 redolist
        if (redoList.length) {
            redoList = [];
        }

        // 添加数据到 undoList
        undoList.unshift({
            range: editor.currentRange(),  // 将当前的range也记录下
            val: val
        });

        // 限制 undoList 长度
        if (undoList.length > length) {
            undoList.pop();
        }
    };

    // undo 操作
    E.fn.undo = function () {
        var editor = this;
        var undoList = _getUndoList(editor);
        var redoList = _getRedoList(editor);

        if (!undoList.length) {
            return;
        }

        // 取出 undolist 第一个值，加入 redolist
        var data = undoList.shift();
        redoList.unshift(data);

        // 并修改编辑器的内容
        _handle(this, data, 'undo');
    };

    // redo 操作
    E.fn.redo = function () {
        var editor = this;
        var undoList = _getUndoList(editor);
        var redoList = _getRedoList(editor);
        if (!redoList.length) {
            return;
        }

        // 取出 redolist 第一个值，加入 undolist
        var data = redoList.shift();
        undoList.unshift(data);

        // 并修改编辑器的内容
        _handle(this, data, 'redo');
    };
});