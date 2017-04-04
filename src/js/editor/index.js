/*
    编辑器构造函数
*/

import $ from '../util/dom-core.js'
import _config from '../config.js'
import Menus from '../menus/index.js'
import Text from '../text/index.js'
import Command from '../command/index.js'
import selectionAPI from '../selection/index.js'

// id，累加
let editorId = 1

// 构造函数
function Editor(toolbarSelector, textSelector) {
    if (toolbarSelector == null) {
        // 没有传入任何参数，报错
        throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档')
    }
    // id，用以区分单个页面不同的编辑器对象
    this.id = 'wangEditor-' + editorId++

    this.toolbarSelector = toolbarSelector
    this.textSelector = textSelector

    // 自定义配置
    this.customConfig = {}
}

// 修改原型
Editor.prototype = {
    constructor: Editor,

    // 初始化 DOM
    _initDom: function () {
        const toolbarSelector = this.toolbarSelector
        const textSelector = this.textSelector
        if (textSelector == null) {
            // 只传入一个参数，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            const $toolbarElem = $('<div><!--wangEditor toolbar--></div>')
            const $textElem = $('<div><!--wangEditor text--><p><br></p></div>')
            // 添加到 DOM 结构中
            $(toolbarSelector).append($toolbarElem).append($textElem)

            // 记录属性
            this.$toolbarElem = $toolbarElem
            this.$textElem = $textElem

            // 自行创建的，需要配置默认的样式
            this.$toolbarElem.css('background-color', '#f1f1f1')
                            .css('border', '1px solid #ccc')
            this.$textElem.css('border-top', 'none')
                            .css('border', '1px solid #ccc')
                            .css('min-height', '300px')
        } else {
            // toolbar 和 text 的选择器都有值，记录属性
            this.$toolbarElem = $(toolbarSelector)
            this.$textElem = $(textSelector)
        }

        // 设置样式
        this.$toolbarElem.addClass('w-e-toolbar')
        this.$textElem.addClass('w-e-text')

        // 设置编辑区域可编辑
        this.$textElem.attr('contenteditable', 'true')
    },

    // 初始化配置
    _initConfig: function () {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        let target = {}
        this.config = Object.assign(target, _config, this.customConfig)
    },

    // 初始化菜单
    _initMenus: function () {
        this.menus = new Menus(this)
        this.menus.init()
    },

    // 添加 text 区域
    _initText: function () {
        this.text = new Text(this)
        this.text.init()
    },

    // 封装 command
    _initCommand: function () {
        this.cmd = new Command(this)
    },

    // 封装 selection range API
    _initSelectionAPI: function () {
        this.sAPI = new selectionAPI(this)
    },

    // 创建编辑器
    create: function () {
        // 初始化 DOM
        this._initDom()

        // 初始化配置信息
        this._initConfig()

        // 初始化菜单
        this._initMenus()

        // 添加 text
        this._initText()

        // 封装 command API
        this._initCommand()

        // 封装 selection range API
        this._initSelectionAPI()
    }
}

export default Editor