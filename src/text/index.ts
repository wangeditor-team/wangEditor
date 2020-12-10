/**
 * @description 编辑区域，入口文件
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import Editor from '../editor/index'
import initEventHooks from './event-hooks/index'
import { UA, throttle } from '../utils/util'
import getChildrenJSON, { NodeListType } from './getChildrenJSON'
import getHtmlByNodeList from './getHtmlByNodeList'

/** 按键函数 */
type KeyBoardHandler = (event: KeyboardEvent) => unknown
/** 普通事件回调 */
type EventHandler = (event: Event) => unknown
// 各个事件钩子函数
type TextEventHooks = {
    changeEvents: (() => void)[] // 内容修改时
    dropEvents: ((event: DragEvent) => unknown)[]
    clickEvents: EventHandler[]
    keyupEvents: KeyBoardHandler[]
    /** tab 键（keyCode === ）Up 时 */
    tabUpEvents: KeyBoardHandler[]
    /** tab 键（keyCode === 9）Down 时 */
    tabDownEvents: KeyBoardHandler[]
    /** enter 键（keyCode === 13）up 时 */
    enterUpEvents: KeyBoardHandler[]
    /** enter 键（keyCode === 13）down 时 */
    enterDownEvents: KeyBoardHandler[]
    /** 删除键（keyCode === 8）up 时 */
    deleteUpEvents: KeyBoardHandler[]
    /** 删除键（keyCode === 8）down 时 */
    deleteDownEvents: KeyBoardHandler[]
    /** 粘贴事件 */
    pasteEvents: ((e: ClipboardEvent) => void)[]
    /** 点击链接事件 */
    linkClickEvents: ((e: DomElement) => void)[]
    /** 点击代码事件 */
    codeClickEvents: ((e: DomElement) => void)[]
    /** 编辑区域滑动事件 */
    textScrollEvents: EventHandler[]
    /** 菜单栏被点击 */
    toolbarClickEvents: EventHandler[]
    /** 图片被点击事件 */
    imgClickEvents: ((e: DomElement) => void)[]
    /** 图片拖拽MouseDown */
    imgDragBarMouseDownEvents: (() => void)[]
    /** 表格点击 */
    tableClickEvents: ((e: DomElement) => void)[]
    /** 每个菜单被点击时，按理说这个不属于 txt 的，先暂时在这放着吧 */
    menuClickEvents: (() => void)[]
    /** droplist 菜单悬浮事件。暂时放这里 */
    dropListMenuHoverEvents: (() => void)[]
    /** 点击分割线时 */
    splitLineEvents: ((e: DomElement) => void)[]
}

class Text {
    public editor: Editor
    public eventHooks: TextEventHooks // Text 各个事件的钩子函数，如 keyup 时要执行哪些函数

    constructor(editor: Editor) {
        this.editor = editor

        this.eventHooks = {
            changeEvents: [],
            dropEvents: [],
            clickEvents: [],
            keyupEvents: [],
            tabUpEvents: [],
            tabDownEvents: [],
            enterUpEvents: [],
            enterDownEvents: [],
            deleteUpEvents: [],
            deleteDownEvents: [],
            pasteEvents: [],
            linkClickEvents: [],
            codeClickEvents: [],
            textScrollEvents: [],
            toolbarClickEvents: [],
            imgClickEvents: [],
            imgDragBarMouseDownEvents: [],
            tableClickEvents: [],
            menuClickEvents: [],
            dropListMenuHoverEvents: [],
            splitLineEvents: [],
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
     * 切换placeholder
     */
    public togglePlaceholder(): void {
        const html = this.html()
        const $placeholder = this.editor.$textContainerElem.find('.placeholder')
        $placeholder.hide()
        if (!html || html === ' ') $placeholder.show()
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

            /**
             * 这里的代码为了处理火狐多余的空行标签,但是强制删除空行标签会带来其他问题
             * html()方法返回的的值,"<p><br></p>"中pr会被删除,只留下<p>,点不进去,从而产生垃圾数据
             * 目前在末位有多个空行的情况下执行撤销重做操作,会产生一种不记录末尾空行的错觉
             * 暂时注释, 等待进一步的兼容处理
             */
            // html = html.replace(/><br>(?!<)/gi, '>') // 过滤 <p><br>内容</p> 中的br
            // html = html.replace(/(?!>)<br></gi, '<') // 过滤 <p>内容<br></p> 中的br

            /**
             * pre标签格式化
             * html()方法理论上应当输出纯净的代码文本,但是对于是否解析html标签还没有良好的判断
             * 如果去除hljs的标签,在解析状态下回显,会造成显示错误并且无法再通过hljs方法渲染
             * 暂且其弃用
             */
            // html = formatCodeHtml(editor, html)

            return html
        }

        // 有 val ，则是设置 html
        val = val.trim()
        if (val === '') {
            val = `<p><br></p>`
        }
        if (val.indexOf('<') !== 0) {
            // 内容用 p 标签包裹
            val = `<p>${val}</p>`
        }

        $textElem.html(val)

        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
    }

    /**
     * 将json设置成html至编辑器
     * @param nodeList json格式
     */
    public setJSON(nodeList: NodeListType): void {
        const html = getHtmlByNodeList(nodeList).children()
        const editor = this.editor
        const $textElem = editor.$textElem
        // 没有获取到元素的情况
        if (!html) return
        // 替换文本节点下全部子节点
        $textElem.replaceChildAll(html)
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
     * 设置 字符串内容
     * @param val text 字符串
     */
    public text(val: string): void
    /**
     * 获取 字符串内容
     */
    public text(): string
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
        if (html.indexOf('<') !== 0) {
            // 普通字符串，用 <p> 包裹
            html = `<p>${html}</p>`
        }
        $textElem.append($(html))

        // 初始化选区，将光标定位到内容尾部
        editor.initSelection()
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
            const selection = editor.selection
            const range = selection.getRange()

            if (range == null) return

            const { startOffset, endOffset } = range
            let endContainer: Node | undefined = range?.endContainer
            // 修复当selection结束时，点击编辑器内部，保存选区异常的情况
            if (startOffset !== endOffset && endContainer != null) {
                range?.setStart(endContainer, endOffset)
            }

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

        // 键盘 up 时的 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            const keyupEvents = eventHooks.keyupEvents
            keyupEvents.forEach(fn => fn(e))
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
        $textElem.on('paste', (e: ClipboardEvent) => {
            if (UA.isIE()) return // IE 不支持

            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault()

            const pasteEvents = eventHooks.pasteEvents
            pasteEvents.forEach(fn => fn(e))
        })

        // 撤销/恢复 快捷键
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (
                // 编辑器处于聚焦状态下（多编辑器实例） || 当前处于兼容模式（兼容模式撤销/恢复后不聚焦，所以直接过，但会造成多编辑器同时撤销/恢复）
                (editor.isFocus || editor.isCompatibleMode) &&
                (e.ctrlKey || e.metaKey) &&
                e.keyCode === 90
            ) {
                // 取消默认行为
                e.preventDefault()
                // 执行事件
                if (e.shiftKey) {
                    // 恢复
                    editor.history.restore()
                } else {
                    // 撤销
                    editor.history.revoke()
                }
            }
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

        // 拖拽相关的事件
        function preventDefault(e: Event) {
            // 禁用 document 拖拽事件
            e.preventDefault()
        }

        $(document)
            .on('dragleave', preventDefault)
            .on('drop', preventDefault)
            .on('dragenter', preventDefault)
            .on('dragover', preventDefault)
        // 全局事件在编辑器实例销毁的时候进行解绑
        editor.beforeDestroy(function () {
            $(document)
                .off('dragleave', preventDefault)
                .off('drop', preventDefault)
                .off('dragenter', preventDefault)
                .off('dragover', preventDefault)
        })

        $textElem.on('drop', (e: DragEvent) => {
            e.preventDefault()
            const events = eventHooks.dropEvents
            events.forEach(fn => fn(e))
        })

        // link click
        $textElem.on('click', (e: Event) => {
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

            if (!$link) return // 没有点击链接，则返回

            const linkClickEvents = eventHooks.linkClickEvents
            linkClickEvents.forEach(fn => fn($link as DomElement))
        })

        // img click
        $textElem.on('click', (e: Event) => {
            // 存储图片元素
            let $img: DomElement | null = null

            const target = e.target as HTMLElement
            const $target = $(target)

            //处理图片点击 判断是否是表情 根据 不存在class或者className!==eleImg、没有alt属性
            if (
                $target.getNodeName() === 'IMG' &&
                (!$target.elems[0].getAttribute('class') ||
                    $target.elems[0].getAttribute('class') !== 'eleImg') &&
                !$target.elems[0].getAttribute('alt')
            ) {
                // 当前点击的就是img
                e.stopPropagation()
                $img = $target
            }
            if (!$img) return // 没有点击图片，则返回

            const imgClickEvents = eventHooks.imgClickEvents
            imgClickEvents.forEach(fn => fn($img as DomElement))
        })

        // code click
        $textElem.on('click', (e: Event) => {
            // 存储代码元素
            let $code: DomElement | null = null

            const target = e.target as HTMLElement
            const $target = $(target)
            if ($target.getNodeName() === 'PRE') {
                // 当前点击的就是一个链接
                $code = $target
            } else {
                // 否则，向父节点中寻找链接
                const $parent = $target.parentUntil('pre')
                if ($parent !== null) {
                    // 找到了
                    $code = $parent
                }
            }

            if (!$code) return

            const codeClickEvents = eventHooks.codeClickEvents
            codeClickEvents.forEach(fn => fn($code as DomElement))
        })

        // splitLine click
        $textElem.on('click', (e: Event) => {
            // 存储分割线元素
            let $splitLine: DomElement | null = null

            const target = e.target as HTMLElement
            const $target = $(target)
            // 判断当前点击元素
            if ($target.getNodeName() === 'HR') {
                $splitLine = $target
            } else {
                $target == null
            }

            if (!$splitLine) return // 没有点击分割线，则返回
            // 设置、恢复选区
            editor.selection.createRangeByElem($splitLine)
            editor.selection.restoreSelection()
            const splitLineClickEvents = eventHooks.splitLineEvents
            splitLineClickEvents.forEach(fn => fn($splitLine as DomElement))
        })

        // 菜单栏被点击
        editor.$toolbarElem.on('click', (e: Event) => {
            const toolbarClickEvents = eventHooks.toolbarClickEvents
            toolbarClickEvents.forEach(fn => fn(e))
        })

        //mousedown事件
        editor.$textContainerElem.on('mousedown', (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const $target = $(target)
            if ($target.hasClass('w-e-img-drag-rb')) {
                // 点击的元素，是图片拖拽调整大小的 bar
                const imgDragBarMouseDownEvents = eventHooks.imgDragBarMouseDownEvents
                imgDragBarMouseDownEvents.forEach(fn => fn())
            }
        })

        //table click
        $textElem.on('click', (e: Event) => {
            // 存储元素
            let $dom: DomElement | null = null

            const target = e.target as HTMLElement

            //获取最祖父元素
            $dom = $(target).parentUntilEditor('TABLE', editor, target)

            // 没有table范围内，则返回
            if (!$dom) return

            const tableClickEvents = eventHooks.tableClickEvents
            tableClickEvents.forEach(fn => fn($dom as DomElement))
        })

        // enter 键 down
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 13) return
            const enterDownEvents = eventHooks.enterDownEvents
            enterDownEvents.forEach(fn => fn(e))
        })
    }
}

export default Text
