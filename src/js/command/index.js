/*
    命令，封装 document.execCommand
*/

// 构造函数
function Command(editor) {
    this.editor = editor
}

// 修改原型
Command.prototype = {
    constructor: Command
}

export default Command