/**
 * @description 编辑器 class
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { EMPTY_FN } from '../utils/const'
import defaultConfig, { ConfigType } from '../config'
import SelectionAndRangeAPI from './selection'
import CommandAPI from './command'
import Text from '../text/index'
import Menus from '../menus/index'
import initDom from './init-fns/init-dom'
import initSelection from './init-fns/init-selection'
import bindEvent, { changeHandler } from './init-fns/bind-event'
import initUpload from './init-fns/init-upload'
import initConfig from './init-fns/init-config'

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
    text: Text
    menus: Menus
    change: Function

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
        this.change = EMPTY_FN

        this.selection = new SelectionAndRangeAPI(this)
        this.cmd = new CommandAPI(this)
        this.text = new Text(this)
        this.menus = new Menus(this)
    }

    /**
     * 初始化选区
     * @param newLine 新建一行
     */
    initSelection(newLine?: boolean): void {
        initSelection(this, newLine)
    }

    /**
     * 创建编辑器实例
     */
    create(): void {
        // 初始化配置
        initConfig(this)

        // 初始化 DOM
        initDom(this)

        // 初始化 text
        this.text.init()

        // 初始化菜单
        this.menus.init()

        // 初始化上传功能
        initUpload(this)

        // 初始化选区，将光标定位到内容尾部
        this.initSelection(true)

        // 绑定事件
        bindEvent(this)
        this.change = changeHandler
    }
}

export default Editor
