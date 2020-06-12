/**
 * @description 封装 document.execCommand
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { UA } from '../utils/util'
import Editor from './index'

class Command {
    editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * 执行富文本操作的命令
     * @param name name
     * @param value value
     */
    do(name: string): void
    do(name: string, value: string): void
    do(name: string, value: DomElement): void
    do(name: string, value?: string | DomElement): void {
        const editor = this.editor

        if (editor.config.styleWithCSS) {
            document.execCommand('styleWithCSS', false, 'true')
        }

        const selection = editor.selection

        // 如果无选区，忽略
        if (!selection.getRange()) {
            return
        }

        // 恢复选取
        selection.restoreSelection()

        // 执行
        switch (name) {
            case 'insertHTML':
                this._insertHTML(value as string)
                break
            case 'insertElem':
                this._insertElem(value as DomElement)
                break
            default:
                // 默认 command
                this._execCommand(name, value as string)
                break
        }

        // 修改菜单状态
        editor.menus.changeActive()

        // 最后，恢复选取保证光标在原来的位置闪烁
        selection.saveRange()
        selection.restoreSelection()

        // 触发 onchange
        editor.change(this.editor)
    }

    /**
     * 插入 html
     * @param html html 字符串
     */
    _insertHTML(html: string): void {
        const editor = this.editor
        const range = editor.selection.getRange()
        if (range == null) return

        if (this.queryCommandSupported('insertHTML')) {
            // W3C
            this._execCommand('insertHTML', html)
        } else if (range.insertNode) {
            // IE
            range.deleteContents()
            range.insertNode($(html).elems[0])
        }
        // else if (range.pasteHTML) {
        //     // IE <= 10
        //     range.pasteHTML(html)
        // }
    }

    /**
     * 插入 DOM 元素
     * @param $elem DOM 元素
     */
    _insertElem($elem: DomElement): void {
        const editor = this.editor
        const range = editor.selection.getRange()
        if (range == null) return

        if (range.insertNode) {
            range.deleteContents()
            range.insertNode($elem.elems[0])
        }
    }

    /**
     * 执行 document.execCommand
     * @param name name
     * @param value value
     */
    _execCommand(name: string, value: string): void {
        document.execCommand(name, false, value)
    }

    /**
     * 执行 document.queryCommandValue
     * @param name name
     */
    queryCommandValue(name: string): string {
        return document.queryCommandValue(name)
    }

    /**
     * 执行 document.queryCommandState
     * @param name name
     */
    queryCommandState(name: string): boolean {
        return document.queryCommandState(name)
    }

    /**
     * 执行 document.queryCommandSupported
     * @param name name
     */
    queryCommandSupported(name: string): boolean {
        return document.queryCommandSupported(name)
    }
}

export default Command
