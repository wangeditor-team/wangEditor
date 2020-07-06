/**
 * @description 编辑区域，入口文件
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import Editor from '../editor/index'
import initEventHooks from './event-hooks/index'
import { UA, throttle } from '../utils/util'
import getChildrenJSON, { NodeListType } from './getChildrenJSON'

// 各个事件钩子函数
type TextEventHooks = {
    dropEvents: Function[]
    clickEvents: Function[]
    keyupEvents: Function[]
    tabUpEvents: Function[] // tab 键（keyCode === ）Up 时
    tabDownEvents: Function[] // tab 键（keyCode === 9）Down 时
    enterUpEvents: Function[] // enter 键（keyCode === 13）up 时
    deleteUpEvents: Function[] // 删除键（keyCode === 8）up 时
    deleteDownEvents: Function[] // 删除键（keyCode === 8）down 时
    pasteEvents: Function[] // 粘贴事件
    linkClickEvents: Function[] // 点击链接事件
    textScrollEvents: Function[] // 编辑区域滑动事件
    toolbarClickEvents: Function[] // 菜单栏被点击
}

class Text {
    public editor: Editor
    public eventHooks: TextEventHooks // Text 各个事件的钩子函数，如 keyup 时要执行哪些函数

    constructor(editor: Editor) {
        this.editor = editor

        this.eventHooks = {
            dropEvents: [],
            clickEvents: [],
            keyupEvents: [],
            tabUpEvents: [],
            tabDownEvents: [],
            enterUpEvents: [],
            deleteUpEvents: [],
            deleteDownEvents: [],
            pasteEvents: [],
            linkClickEvents: [],
            textScrollEvents: [],
            toolbarClickEvents: [],
        }
    }

    /**
     * 初始化
     */
    public init(): void {
        // 实时保存选取范围
        this._saveRange()

        // 绑定事件
        this._bindEventHooks()

        // 初始化 text 事件钩子函数
        initEventHooks(this)
    }

    /**
     * 清空内容
     */
    public clear(): void {
        this.html('<p><br></p>')
    }

    /**
     * 设置/获取 html
     * @param val html 字符串
     */
    public html(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，则是获取 html
        if (val == null) {
            let html = $textElem.html()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            html = html.replace(/\u200b/gm, '')
            html = html.replace(/<p><\/p>/gim, '') // 去掉空行
            html = html.replace(/<p><br\/?><\/p>$/gim, '') // 去掉最后的 <p><br><p>
            return html
        }

        // 有 val ，则是设置 html
        $textElem.html(val)
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    /**
     * 获取 json 格式的数据
     */
    public getJSON(): NodeListType {
        const editor = this.editor
        const $textElem = editor.$textElem
        return getChildrenJSON($textElem)
    }

    /**
     * 获取/设置 字符串内容
     * @param val text 字符串
     */
    public text(val?: string): void | string {
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
    public append(html: string): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        $textElem.append($(html))

        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    /**
     * 格式化 html 内容，让最外层的标签符合规范
     */
    public formatHtml(): void {
        let curHtml = this.html() || ''

        // 忽略 <br> 换行
        curHtml = curHtml.replace(/<br>|<br\/>/gim, '')

        // div 全部替换为 p 标签
        curHtml = curHtml.replace(/<div>/gim, '<p>').replace(/<\/div>/gim, '</p>')

        // 不允许空行，放在最后
        curHtml = curHtml.replace(/<p><\/p>/gim, '<p><br></p>')

        // 重置 html
        this.html(curHtml)
    }

    /**
     * 每一步操作，都实时保存选区范围
     */
    private _saveRange(): void {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 保存当前的选区
        function saveRange() {
            // 随时保存选区
            editor.selection.saveRange()
            // 更新按钮 active 状态
            editor.menus.changeActive()
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
    private _bindEventHooks(): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        const eventHooks = this.eventHooks

        // click hooks
        $textElem.on('click', (e: Event) => {
            const clickEvents = eventHooks.clickEvents
            clickEvents.forEach(fn => fn(e))
        })

        // enter 键 up 时的 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 13) return
            const enterUpEvents = eventHooks.enterUpEvents
            enterUpEvents.forEach(fn => fn(e))
        })

        // delete 键 up 时 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) return
            const deleteUpEvents = eventHooks.deleteUpEvents
            deleteUpEvents.forEach(fn => fn(e))
        })

        // delete 键 down 时 hooks
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) return
            const deleteDownEvents = eventHooks.deleteDownEvents
            deleteDownEvents.forEach(fn => fn(e))
        })

        // 粘贴
        $textElem.on('paste', (e: Event) => {
            if (UA.isIE()) return // IE 不支持

            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault()

            const pasteEvents = eventHooks.pasteEvents
            pasteEvents.forEach(fn => fn(e))
        })

        // tab up
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 9) return
            e.preventDefault()
            const tabUpEvents = eventHooks.tabUpEvents
            tabUpEvents.forEach(fn => fn(e))
        })

        // tab down
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 9) return
            e.preventDefault()
            const tabDownEvents = eventHooks.tabDownEvents
            tabDownEvents.forEach(fn => fn(e))
        })

        // 文本编辑区域 滚动时触发
        $textElem.on(
            'scroll',
            // 使用节流
            throttle((e: Event) => {
                const textScrollEvents = eventHooks.textScrollEvents
                textScrollEvents.forEach(fn => fn(e))
            }, 100)
        )

        // link click
        $textElem.on('click', (e: Event) => {
            e.preventDefault()

            // 存储链接元素
            let $link: DomElement | null = null

            const target = e.target as HTMLElement
            const $target = $(target)
            if ($target.getNodeName() === 'A') {
                // 当前点击的就是一个链接
                $link = $target
            } else {
                // 否则，向父节点中寻找链接
                const $parent = $target.parentUntil('a')
                if ($parent != null) {
                    // 找到了
                    $link = $parent
                }
            }

            if ($link == null) return // 没有点击链接，则返回

            const linkClickEvents = eventHooks.linkClickEvents
            linkClickEvents.forEach(fn => fn($link))
        })

        // 菜单栏被点击
        editor.$toolbarElem.on('click', (e: Event) => {
            const toolbarClickEvents = eventHooks.toolbarClickEvents
            toolbarClickEvents.forEach(fn => fn(e))
        })
    }
}

export default Text
