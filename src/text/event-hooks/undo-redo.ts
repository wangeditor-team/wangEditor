/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

class Revoke {
    private undoArray: string[]
    private redoArray: string[]
    private undoString: string | undefined
    private redoString: string | undefined

    public editor: Editor

    public undo(editor: Editor) {
        // 获取undo最后一位元素
        const last = this.undoArray.pop()

        if (!last) return false

        // redo 入栈
        if (typeof last === 'string') {
            this.redoArray.push(last)
        }
        this.undoString = last
        // 设置文本内容
        this.editor.txt.html(last)
    }

    public redo(editor: Editor) {
        // 获取redo第一个文本
        const first = this.redoArray.pop()

        if (!first) return false

        // undo 入栈
        if (typeof first === 'string') {
            this.undoArray.push(first)
        }
        this.redoString = first
        // 设置文本
        this.editor.txt.html(first)
    }

    public onChangeAfter(editor: Editor) {
        // 获取文本内容
        const str = editor.txt.html()

        // 判断类型
        if (typeof str === 'string' && str !== editor.revoke.undoString) {
            this.undoArray.push(str)
        }
    }

    public onCustomActionAfter() {}

    constructor(editor: Editor) {
        this.editor = editor
        this.undoArray = []
        this.redoArray = []

        // change钩子
        editor.txt.eventHooks.changeEvents.push(() => {
            this.onChangeAfter(editor)
        })
    }
}

export default Revoke
