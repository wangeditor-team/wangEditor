/**
 * @description 编辑区域，入口文件
 * @author wangfupeng
 */

import $ from '../utils/dom-core'
import Editor from '../editor/index'
import initEventHooks from './event-hooks'
import { UA } from '../utils/util'

// 各个事件钩子函数
type TextEventHooks = {
    dropEvents: Function[]
    keyupEvents: Function[]
    enterUpEvents: Function[] // enter 键（keyCode === 13）up 时
    deleteUpEvents: Function[] // 删除键（keyCode === 8）up 时
    deleteDownEvents: Function[] // 删除键（keyCode === 8）down 时
    pasteEvents: Function[] // 粘贴事件
}

class Text {
    editor: Editor
    eventHooks: TextEventHooks // Text 各个事件的钩子函数，如 keyup 时要执行哪些函数

    constructor(editor: Editor) {
        this.editor = editor

        this.eventHooks = {
            dropEvents: [],
            keyupEvents: [],
            enterUpEvents: [],
            deleteUpEvents: [],
            deleteDownEvents: [],
            pasteEvents: [],
        }
    }

    /**
     * 初始化
     */
    init(): void {
        // 实时保存选取范围
        this._saveRange()

        // 初始化 text 事件钩子函数
        initEventHooks(this)

        // 绑定事件
        this._bindEvent()
    }

    /**
     * 清空内容
     */
    clear(): void {
        this.html('<p><br></p>')
    }

    /**
     * 设置/获取 html
     * @param val html 字符串
     */
    html(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，则是获取 html
        if (val == null) {
            let html = $textElem.html()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            html = html.replace(/\u200b/gm, '')
            return html
        }

        // 有 val ，则是设置 html
        $textElem.html(val)
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    // 获取 JSON

    /**
     * 获取/设置 字符串内容
     * @param val text 字符串
     */
    text(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，是获取 text
        if (val == null) {
            let text = $textElem.text()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            text = text.replace(/\u200b/gm, '')
            return text
        }

        // 有 val ，则是设置 text
        $textElem.text(`<p>${val}</p>`)
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    /**
     * 追加 html 内容
     * @param html html 字符串
     */
    append(html: string): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        $textElem.append($(html))

        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    /**
     * 每一步操作，都实时保存选区范围
     */
    _saveRange(): void {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 保存当前的选区
        function saveRange() {
            // 随时保存选区
            editor.selection.saveRange()
            // 更新按钮 ative 状态
            // editor.menus.changeActive()
        }

        // 按键后保存
        $textElem.on('keyup', saveRange)
        $textElem.on('mousedown', () => {
            // mousedown 状态下，鼠标滑动到编辑区域外面，也需要保存选区
            $textElem.on('mouseleave', saveRange)
        })
        $textElem.on('mouseup', () => {
            saveRange()
            // 在编辑器区域之内完成点击，取消鼠标滑动到编辑区外面的事件
            $textElem.off('mouseleave', saveRange)
        })
    }

    /**
     * 绑定事件，事件会触发钩子函数
     */
    _bindEvent(): void {
        const $textElem = this.editor.$textElem
        const eventHooks = this.eventHooks

        // enter 键 up 时的 hooks
        const enterUpEvents = eventHooks.enterUpEvents
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 13) {
                // 不是回车键
                return
            }
            enterUpEvents.forEach(fn => fn(e))
        })

        // delete 键 up 时 hooks
        const deleteUpEvents = eventHooks.deleteUpEvents
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) {
                // 不是删除键
                return
            }
            deleteUpEvents.forEach(fn => fn(e))
        })

        // delete 键 down 时 hooks
        const deleteDownEvents = eventHooks.deleteDownEvents
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) {
                // 不是删除键
                return
            }
            deleteDownEvents.forEach(fn => fn(e))
        })

        // 粘贴
        const pasteEvents = eventHooks.pasteEvents
        $textElem.on('paste', (e: Event) => {
            if (UA.isIE()) {
                return
            } else {
                // 阻止默认行为，使用 execCommand 的粘贴命令
                e.preventDefault()
            }
            pasteEvents.forEach(fn => fn(e))
        })
    }
}

export default Text
