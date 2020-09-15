/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'

/**
 * 撤销类
 * 选区的变化不能触发change事件,但我仍然保留了记录与恢复选区的代码
 * 后续如果能使用能够记录选区的api,那么这种记录方式仍然可用
 */
class Revoke {
    // 撤销栈
    private undoStack: (RevokeItem | undefined)[]
    // 重做栈
    private redoStack: (RevokeItem | undefined)[]
    // 记录缓存
    private undoString: RevokeItem | undefined
    // 编辑器实例
    public editor: Editor

    public undo(editor: Editor) {
        // 获取undo最后一位元素
        const last = this.undoStack.pop()
        const limit = this.editor.config.revokeLength
        // 类型判断
        if (typeof last?.text !== 'string') return false

        // redo 入栈
        this.redoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.undoStack.length > limit) this.undoStack.shift()

        this.undoString = last

        // 设置文本内容
        this.editor.txt.html(last?.text)

        // @ts-ignore
        // selection中的range默认值 Range | null | undefined未统一 有待修改
        // 恢复选区
        this.editor.selection.saveRange(last.range)
    }

    public redo(editor: Editor) {
        // 获取redo第一个文本
        const first = this.redoStack.pop()
        const limit = this.editor.config.revokeLength

        // 类型判断
        if (typeof first?.text !== 'string') return false

        // undo 入栈
        this.undoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.redoStack.length > limit) this.redoStack.shift()

        this.undoString = first
        // 设置文本
        this.editor.txt.html(first?.text)

        // @ts-ignore
        // selection中的range默认值 Range | null | undefined未统一 有待修改
        // 恢复选区
        this.editor.selection.saveRange(first.range)
    }

    public onChangeAfter(editor: Editor) {
        // 获取文本内容
        const str = editor.txt.html()
        const range = editor.selection.getRange()

        // 类型不符
        if (typeof str !== 'string') return false

        // 判断缓存
        if (str === editor.revoke.undoString.text) return false

        // 缓存推入撤销栈
        editor.revoke.undoStack.push(editor.revoke.undoString)

        // 更新缓存
        editor.revoke.undoString = new RevokeItem(range, str)

        // 清空重做栈
        editor.revoke.redoStack.length = 0
    }

    constructor(editor: Editor) {
        this.editor = editor
        this.undoStack = []
        this.redoStack = []

        // 初始化缓存字符串与撤销栈
        const str = editor.txt.html()
        const range = editor.selection.getRange()
        if (typeof str === 'string') {
            this.undoStack.push(new RevokeItem(range, str))
            this.undoString = new RevokeItem(range, str)
        }

        // change钩子
        editor.txt.eventHooks.changeEvents.push(() => {
            this.onChangeAfter(editor)
        })

        // 添加撤销事件
        editor.txt.eventHooks.revokeEvents.push(() => {
            this.undo(editor)
        })
    }
}

/**
 * RevokeItem 撤销栈基础类
 * range 选区
 * text 文本内容
 * */
class RevokeItem {
    public range: Range | null
    public text: string

    constructor(range: Range | null, text: string) {
        this.range = range
        this.text = text
    }
}

export default Revoke
