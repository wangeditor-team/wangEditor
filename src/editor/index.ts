/**
 * @description 编辑器 class
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import defaultConfig, { ConfigType } from './config'
import { getRandom } from '../utils/util'
import SelectionAndRangeAPI from './selection'
import CommandAPI from './command'
import Text from '../text/index'

let EDITOR_ID = 1

class Editor {
    id: string
    toolbarSelector: string
    textSelector: string | undefined
    customConfig: ConfigType
    config: ConfigType
    $toolbarElem: DomElement
    $textContainerElem: DomElement
    $textElem: DomElement
    toolbarElemId: string
    textElemId: string
    isFocus: boolean
    selection: SelectionAndRangeAPI
    cmd: CommandAPI
    change: Function | undefined
    text: Text

    /**
     * 构造函数
     * @param toolbarSelector 工具栏 DOM selector
     * @param textSelector 文本区域 DOM selector
     */
    constructor(toolbarSelector: string, textSelector?: string) {
        // id，用以区分单个页面不同的编辑器对象
        this.id = `wangEditor-${EDITOR_ID++}`

        this.toolbarSelector = toolbarSelector
        this.textSelector = textSelector

        if (toolbarSelector == null) {
            throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档')
        }

        // 属性的默认值，后面可能会再修改
        this.customConfig = defaultConfig // 自定义配置，先赋值为默认配置
        this.config = defaultConfig // 默认配置
        this.$toolbarElem = $('<div></div>')
        this.$textContainerElem = $('<div></div>')
        this.$textElem = $('<div></div>')
        this.toolbarElemId = ''
        this.textElemId = ''
        this.isFocus = false

        this.selection = new SelectionAndRangeAPI(this)
        this.cmd = new CommandAPI(this)
        this.text = new Text(this)
    }

    /**
     * 初始化配置
     */
    _initConfig(): void {
        // 自定义配置和默认配置，合并
        this.config = Object.assign({}, defaultConfig, this.customConfig)

        // 原先版本中，此处有多语言配置
    }

    /**
     * 初始化 DOM 结构
     */
    _initDom(): void {
        const toolbarSelector = this.toolbarSelector
        const $toolbarSelector = $(toolbarSelector)
        const textSelector = this.textSelector

        const config = this.config
        const zIndex = config.zIndex

        let $toolbarElem: DomElement
        let $textContainerElem: DomElement
        let $textElem: DomElement
        let $children: DomElement | null

        if (textSelector == null) {
            // 只有 toolbarSelector ，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            $toolbarElem = $('<div></div>')
            $textContainerElem = $('<div></div>')

            // 将编辑器区域原有的内容，暂存起来
            $children = $toolbarSelector.children()

            // 添加到 DOM 结构中
            $toolbarSelector.append($toolbarElem).append($textContainerElem)

            // 自行创建的，需要配置默认的样式
            $toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc')
            $textContainerElem
                .css('border', '1px solid #ccc')
                .css('border-top', 'none')
                .css('height', '300px')
        } else {
            // toolbarSelector 和 textSelector 都有
            $toolbarElem = $toolbarSelector
            $textContainerElem = $(textSelector)
            // 将编辑器区域原有的内容，暂存起来
            $children = $textContainerElem.children()
        }

        // 编辑区域
        $textElem = $('<div></div>')
        $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%')

        // 初始化编辑区域内容
        if ($children && $children.length) {
            $textElem.append($children)
        } else {
            $textElem.append($('<p><br></p>')) // 新增一行，方便继续编辑
        }

        // 编辑区域加入DOM
        $textContainerElem.append($textElem)

        // 设置通用的 class
        $toolbarElem.addClass('w-e-toolbar')
        $textContainerElem.addClass('w-e-text-container')
        $textContainerElem.css('z-index', `${zIndex}`)
        $textElem.addClass('w-e-text')

        // 添加 ID
        const toolbarElemId = getRandom('toolbar-elem')
        $toolbarElem.attr('id', toolbarElemId)
        const textElemId = getRandom('text-elem')
        $textElem.attr('id', textElemId)

        // 记录属性
        this.$toolbarElem = $toolbarElem
        this.$textContainerElem = $textContainerElem
        this.$textElem = $textElem
        this.toolbarElemId = toolbarElemId
        this.textElemId = textElemId

        // 记录输入法的开始和结束
        let compositionEnd = true
        $textContainerElem.on('compositionstart', () => {
            // 输入法开始输入
            compositionEnd = false
        })
        $textContainerElem.on('compositionend', () => {
            // 输入法结束输入
            compositionEnd = true
        })

        // 绑定 onchange
        $textContainerElem.on('click keyup', () => {
            // 输入法结束才出发 onchange
            if (compositionEnd) {
                console.log('此处触发 onChange 事件')
            }
        })
        $toolbarElem.on('click', function () {
            console.log('此处触发 onChange 事件')
        })

        // 绑定 onfocus 与 onblur 事件
        if (config.onfocus || config.onblur) {
            // 当前编辑器是否是焦点状态
            this.isFocus = false

            $(document).on('click', (e: Event) => {
                const target = e.target
                const $target = $(target)

                //判断当前点击元素是否在编辑器内
                const isChild = $textElem.isContain($target)

                //判断当前点击元素是否为工具栏
                const isToolbar = $toolbarElem.isContain($target)
                const isMenu = $toolbarElem.elems[0] == e.target ? true : false

                if (!isChild) {
                    //若为选择工具栏中的功能，则不视为成 blur 操作
                    if (isToolbar && !isMenu) {
                        return
                    }

                    if (this.isFocus) {
                        console.log('触发 onblur 事件')
                    }
                    this.isFocus = false
                } else {
                    if (!this.isFocus) {
                        console.log('触发 onfocus 事件')
                    }
                    this.isFocus = true
                }
            })
        }
    }

    /**
     * 初始化选取，将光标定位到文档末尾
     * @param newLine 是否新增一行
     */
    initSelection(newLine?: boolean): void {
        console.log('initSelection', newLine)
    }

    /**
     * 绑定事件
     */
    _bindEvent(): void {
        console.log('_bindEvent')
    }

    /**
     * 创建编辑器实例
     */
    create(): void {
        // 初始化配置
        this._initConfig()

        // 初始化 DOM
        this._initDom()

        // 初始化 text
        this.text.init()

        console.log('初始化菜单') // 原来的 _initMenus

        console.log('初始化图片上传') // 原来的 _initUploadImg

        // 初始化选区，将光标定位到内容尾部
        this.initSelection(true)

        // 绑定事件
        this._bindEvent()
    }
}

export default Editor
