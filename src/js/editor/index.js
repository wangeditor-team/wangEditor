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
import { arrForEach, objForEach } from '../util/util.js'
import { getRandom } from '../util/util.js'

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

    // 初始化配置
    _initConfig: function () {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        let target = {}
        this.config = Object.assign(target, _config, this.customConfig)

        // 将语言配置，生成正则表达式
        const langConfig = this.config.lang || {}
        const langArgs = []
        objForEach(langConfig, (key, val) => {
            // key 即需要生成正则表达式的规则，如“插入链接”
            // val 即需要被替换成的语言，如“insert link”
            langArgs.push({
                reg: new RegExp(key, 'img'),
                val: val

            })
        })
        this.config.langArgs = langArgs
    },

    // 初始化 DOM
    _initDom: function () {
        const toolbarSelector = this.toolbarSelector
        const $toolbarSelector = $(toolbarSelector)
        const textSelector = this.textSelector

        const config = this.config
        const zIndex = config.zIndex

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
        $textContainerElem.css('z-index', zIndex)
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

        // 绑定 onchange
        $textContainerElem.on('click keyup', () => {
            this.change &&  this.change()
        })
        $toolbarElem.on('click', function () {
            this.change &&  this.change()
        })

        //绑定 blur
        $(document).on('click', function(e){
            //判断当前点击元素是否在编辑器内
            let isChild = $toolbarSelector.isContain($(e.target))
            if(!isChild){
                this.blur && this.blur()
            }
        })
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

    // 初始化选区，将光标定位到内容尾部
    initSelection: function (newLine) {
        const $textElem = this.$textElem
        const $children = $textElem.children()
        if (!$children.length) {
            // 如果编辑器区域无内容，添加一个空行，重新设置选区
            $textElem.append($('<p><br></p>'))
            this.initSelection()
            return
        }

        const $last = $children.last()

        if (newLine) {
            // 新增一个空行
            const html = $last.html().toLowerCase()
            const nodeName = $last.getNodeName()
            if ((html !== '<br>' && html !== '<br\/>') || nodeName !== 'P') {
                // 最后一个元素不是 <p><br></p>，添加一个空行，重新设置选区
                $textElem.append($('<p><br></p>'))
                this.initSelection()
                return
            }
        }

        this.selection.createRangeByElem($last, false, true)
        this.selection.restoreSelection()
    },

    // 绑定事件
    _bindEvent: function () {
        // -------- 绑定 onchange 事件 --------
        let onChangeTimeoutId = 0
        let beforeChangeHtml = this.txt.html()
        const config = this.config
        const onchange = config.onchange
        if (onchange && typeof onchange === 'function'){
            // 触发 change 的有三个场景：
            // 1. $textContainerElem.on('click keyup')
            // 2. $toolbarElem.on('click')
            // 3. editor.cmd.do()
            this.change = function () {
                // 判断是否有变化
                const currentHtml = this.txt.html()
                if (currentHtml.length === beforeChangeHtml.length) {
                    return
                }

                // 执行，使用节流
                if (onChangeTimeoutId) {
                    clearTimeout(onChangeTimeoutId)
                }
                onChangeTimeoutId = setTimeout(() => {
                    // 触发配置的 onchange 函数
                    onchange(currentHtml)
                    beforeChangeHtml = currentHtml
                }, 200)
            }   
        }

        // -------- 绑定 blur 事件 --------
        let beforeBlurHtml = this.txt.html()
        const blur = this.config.blur
        if(blur && typeof blur === 'function') {
            this.blur = function () {
                const currentHtml = this.txt.html()
                if (currentHtml === beforeBlurHtml) {
                    return
                }
                blur(currentHtml)
                beforeBlurHtml = currentHtml
            }
        }
    },

    // 创建编辑器
    create: function () {
        // 初始化配置信息
        this._initConfig()

        // 初始化 DOM
        this._initDom()

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

        // 初始化选区，将光标定位到内容尾部
        this.initSelection(true)

        // 绑定事件
        this._bindEvent()
    }
}

export default Editor