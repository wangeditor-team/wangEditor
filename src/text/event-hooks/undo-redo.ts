/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

class Revoke {
    private undoStack: string[]
    private redoStack: string[]
    private undoString: string | undefined
    private redoString: string | undefined

    public editor: Editor

    public undo(editor: Editor) {
        // 获取undo最后一位元素
        const last = this.undoStack.pop()

        if (!last) return false

        // redo 入栈
        if (typeof last === 'string') {
            this.redoStack.push(last)
        }
        this.undoString = last
        // 设置文本内容
        this.editor.txt.html(last)
    }

    public redo(editor: Editor) {
        // 获取redo第一个文本
        const first = this.redoStack.shift()

        if (!first) return false

        // undo 入栈
        if (typeof first === 'string') {
            this.undoStack.push(first)
        }
        this.redoString = first
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

        const str = editor.txt.html()
        if (typeof str === 'string') {
            this.undoStack.push(str)
        }

        // change钩子
        editor.txt.eventHooks.changeEvents.push(() => {
            this.onChangeAfter(editor)
        })
    }
}

export default Revoke
