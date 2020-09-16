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
import i18nextInit from './init-fns/i18next-init'
import Undo from './undo-redo'

// 创建菜单的 class
import BtnMenu from '../menus/menu-constructors/BtnMenu'
import DropList from '../menus/menu-constructors/DropList'
import DropListMenu from '../menus/menu-constructors/DropListMenu'
import Panel from '../menus/menu-constructors/Panel'
import PanelMenu from '../menus/menu-constructors/PanelMenu'
import Tooltip from '../menus/menu-constructors/Tooltip'

let EDITOR_ID = 1

class Editor {
    // 存储自定义菜单的构造函数
    static menuConstructors: {
        [key: string]: Function
    } = {}

    // 暴露 $
    static $: Function = $

    public id: string
    public toolbarSelector: string
    public textSelector: string | undefined
    public config: ConfigType
    public $toolbarElem: DomElement
    public $textContainerElem: DomElement
    public $textElem: DomElement
    public toolbarElemId: string
    public textElemId: string
    public isFocus: boolean
    public selection: SelectionAndRangeAPI
    public cmd: CommandAPI
    public txt: Text
    public menus: Menus
    public i18next: any
    public highlight: any
    public undo: Undo

    // 实例销毁前需要执行的钩子集合
    private beforeDestroyHooks: Function[] = []

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
        this.config = defaultConfig // 默认配置
        this.$toolbarElem = $('<div></div>')
        this.$textContainerElem = $('<div></div>')
        this.$textElem = $('<div></div>')
        this.toolbarElemId = ''
        this.textElemId = ''
        this.isFocus = false

        this.selection = new SelectionAndRangeAPI(this)
        this.cmd = new CommandAPI(this)
        this.txt = new Text(this)
        this.menus = new Menus(this)
        this.undo = new Undo(this)
    }

    /**
     * 初始化选区
     * @param newLine 新建一行
     */
    public initSelection(newLine?: boolean): void {
        initSelection(this, newLine)
    }

    /**
     * 创建编辑器实例
     */
    public create(): void {
        // 国际化 因为要在创建菜单前使用 所以要最先 初始化
        i18nextInit(this)

        // 初始化 DOM
        initDom(this)

        // 初始化 text
        this.txt.init()

        // 初始化菜单
        this.menus.init()

        // 初始化选区，将光标定位到内容尾部
        this.initSelection(true)

        // 绑定事件
        bindEvent(this)
    }

    public change(): void {
        changeHandler(this)
    }

    /**
     * 提供给用户添加销毁前的钩子函数
     * @param fn 钩子函数
     */
    public beforeDestroy(fn: Function): Editor {
        this.beforeDestroyHooks.push(fn)
        return this
    }

    /**
     * 销毁当前编辑器实例
     */
    public destroy(): void {
        // 调用钩子函数
        this.beforeDestroyHooks.forEach(fn => fn.call(this))

        // 销毁 DOM 节点
        this.$toolbarElem.remove()
        this.$textContainerElem.remove()
    }
}

// 暴露创建菜单的 class
Editor.menuConstructors = {
    BtnMenu,
    DropList,
    DropListMenu,
    Panel,
    PanelMenu,
    Tooltip,
}

export default Editor
