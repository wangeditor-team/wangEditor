/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'

/**
 * 撤销类
 */
class Undo {
    constructor(editor: Editor) {
        this.editor = editor
        this.undoStack = []
        this.redoStack = []
        this.flag = false

        // 初始化缓存字符串与撤销栈
        const str = editor.txt.html()
        if (typeof str === 'string') {
            this.undoStack.push(str)
            this.undoString = str
        }

        // change钩子
        editor.txt.eventHooks.changeEvents.push(() => {
            this.onChangeAfter(editor)
        })
    }

    // 撤销栈
    private undoStack: string[]
    // 重做栈
    private redoStack: string[]
    // 记录缓存
    private undoString: string = ''
    // 操作标示
    private flag: boolean
    // 编辑器实例
    public editor: Editor

    public undo(editor: Editor) {
        // 获取undo最后一位元素
        const last = this.undoStack.pop()
        const limit = this.editor.config.revokeLimit
        // 类型判断
        if (typeof last !== 'string') return false

        // 更新标示
        this.flag = true

        // redo 入栈
        this.redoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.undoStack.length > limit) this.undoStack.shift()

        this.undoString = last

        // 设置文本内容
        this.editor.txt.html(last)
    }

    public redo(editor: Editor) {
        // 获取redo第一个文本
        const first = this.redoStack.pop()
        const limit = this.editor.config.revokeLimit

        // 类型判断
        if (typeof first !== 'string') return false

        // 更新标示
        this.flag = true

        // undo 入栈
        this.undoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.redoStack.length > limit) this.redoStack.shift()

        this.undoString = first
        // 设置文本
        this.editor.txt.html(first)
    }

    public onChangeAfter(editor: Editor) {
        // 获取文本内容
        const str = editor.txt.html()

        // 类型不符
        if (typeof str !== 'string') return false

        // 判断标示 是否正在执行撤销操作
        if (editor.revoke.flag) {
            // 更新标示
            editor.revoke.flag = false
            // 不执行记录操作
            return false
        }

        // 缓存推入撤销栈
        editor.revoke.undoStack.push(editor.revoke.undoString)

        // 更新缓存
        editor.revoke.undoString = str

        // 清空重做栈
        editor.revoke.redoStack.length = 0

        // 更新标示
        editor.revoke.flag = false
    }
}

export default Undo
