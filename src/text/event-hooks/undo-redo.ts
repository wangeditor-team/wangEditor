/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

class Revoke {
    private undoStack: string[]
    private redoStack: string[]
    private undoString: string = ''
    private redoString: string | undefined

    public editor: Editor

    public undo(editor: Editor) {
        // 获取undo最后一位元素
        const last = this.undoStack.pop()

        // 类型判断
        if (typeof last !== 'string') return false

        // redo 入栈
        this.redoStack.push(this.undoString)

        this.undoString = last

        // 设置文本内容
        this.editor.txt.html(last)
    }

    public redo(editor: Editor) {
        // 获取redo第一个文本
        const first = this.redoStack.pop()

        // 类型判断
        if (typeof first !== 'string') return false

        // undo 入栈
        this.undoStack.push(this.undoString)

        this.undoString = first
        // 设置文本
        this.editor.txt.html(first)
    }

    public onChangeAfter(editor: Editor) {
        // 获取文本内容
        const str = editor.txt.html()

        // 类型不符
        if (typeof str !== 'string') return false

        // 判断缓存
        if (str === editor.revoke.undoString) return false

        // 缓存推入撤销栈
        editor.revoke.undoStack.push(editor.revoke.undoString)

        // 更新缓存
        editor.revoke.undoString = str

        // 清空重做栈
        editor.revoke.redoStack.length = 0
    }

    public onCustomActionAfter() {}

    constructor(editor: Editor) {
        this.editor = editor
        this.undoStack = []
        this.redoStack = []

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

        // 添加撤销事件
        editor.txt.eventHooks.revokeEvents.push(() => {
            this.undo(editor)
        })
    }
}

export default Revoke
