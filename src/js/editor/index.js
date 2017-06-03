/*
    编辑器构造函数
*/

import $ from '../util/dom-core.js'
import _config from '../config.js'
import Menus from '../menus/index.js'
import Text from '../text/index.js'
import Command from '../command/index.js'
import selectionAPI from '../selection/index.js'
import UploadImg from './upload/upload-img.js'
import Bar from './bar/bar.js'
import { arrForEach } from '../util/util.js'

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
        const $toolbarSelector = $(toolbarSelector)
        const textSelector = this.textSelector

        // 定义变量
        let $toolbarElem, $textContainerElem, $textElem, $children

        if (textSelector == null) {
            // 只传入一个参数，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            $toolbarElem = $('<div></div>')
            $textContainerElem = $('<div></div>')

            // 将编辑器区域原有的内容，暂存起来
            $children = $toolbarSelector.children()

            // 添加到 DOM 结构中
            $toolbarSelector.append($toolbarElem).append($textContainerElem)

            // 自行创建的，需要配置默认的样式
            $toolbarElem.css('background-color', '#f1f1f1')
                            .css('border', '1px solid #ccc')
            $textContainerElem.css('border', '1px solid #ccc')
                            .css('border-top', 'none')
                            .css('height', '300px')
        } else {
            // toolbar 和 text 的选择器都有值，记录属性
            $toolbarElem = $toolbarSelector
            $textContainerElem = $(textSelector)
            // 将编辑器区域原有的内容，暂存起来
            $children = $textContainerElem.children()
        }

        // 编辑区域
        $textElem = $('<div></div>')
        $textElem.attr('contenteditable', 'true')
                .css('width', '100%')
                .css('height', '100%')

        // 初始化编辑区域内容
        if ($children && $children.length) {
            $textElem.append($children)
        } else {
            $textElem.append($('<p><br></p>'))
        }

        // 编辑区域加入DOM
        $textContainerElem.append($textElem)

        // 设置通用的 class
        $toolbarElem.addClass('w-e-toolbar')
        $textContainerElem.addClass('w-e-text-container')
        $textElem.addClass('w-e-text')

        // 记录属性
        this.$toolbarElem = $toolbarElem
        this.$textContainerElem = $textContainerElem
        this.$textElem = $textElem
    },

    // 初始化配置
    _initConfig: function () {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        let target = {}
        this.config = Object.assign(target, _config, this.customConfig)
    },

    // 封装 command
    _initCommand: function () {
        this.cmd = new Command(this)
    },

    // 封装 selection range API
    _initSelectionAPI: function () {
        this.selection = new selectionAPI(this)
    },

    // 添加图片上传
    _initUploadImg: function () {
        this.uploadImg = new UploadImg(this)
    },

    // 初始化菜单
    _initMenus: function () {
        this.menus = new Menus(this)
        this.menus.init()
    },

    // 添加 text 区域
    _initText: function () {
        this.txt = new Text(this)
        this.txt.init()
    },

    // 添加 bar
    _addBar: function () {
        this.bar = new Bar(this)
        this.bar.init()
    },

    // 创建编辑器
    create: function () {
        // 初始化 DOM
        this._initDom()

        // 初始化配置信息
        this._initConfig()

        // 封装 command API
        this._initCommand()

        // 封装 selection range API
        this._initSelectionAPI()

        // 添加 text
        this._initText()

        // 初始化菜单
        this._initMenus()

        // 添加 图片上传
        this._initUploadImg()

        // 添加 bar
        this._addBar()
    }
}

export default Editor