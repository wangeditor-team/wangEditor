/*
    panel
*/

import $ from '../util/dom-core.js'
import replaceLang from '../util/replace-lang.js'
const emptyFn = () => {}

// 记录已经显示 panel 的菜单
let _isCreatedPanelMenus = []

// 构造函数
function Panel(menu, opt) {
    this.menu = menu
    this.opt = opt
}

// 原型
Panel.prototype = {
    constructor: Panel,

    // 显示（插入DOM）
    show: function () {
        const menu = this.menu
        if (_isCreatedPanelMenus.indexOf(menu) >= 0) {
            // 该菜单已经创建了 panel 不能再创建
            return
        }

        const editor = menu.editor
        const $body = $('body')
        const $textContainerElem = editor.$textContainerElem
        const opt = this.opt

        // panel 的容器
        const $container = $('<div class="w-e-panel-container"></div>')
        const width = opt.width || 300 // 默认 300px
        $container.css('width', width + 'px')
                .css('margin-left', (0 - width)/2 + 'px')

        // 添加关闭按钮
        const $closeBtn = $('<i class="w-e-icon-close w-e-panel-close"></i>')
        $container.append($closeBtn)
        $closeBtn.on('click', () => {
            this.hide()
        })

        // 准备 tabs 容器
        const $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>')
        const $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>')
        $container.append($tabTitleContainer).append($tabContentContainer)

        // 设置高度
        const height = opt.height
        if (height) {
            $tabContentContainer.css('height', height + 'px').css('overflow-y', 'auto')
        }
        
        // tabs
        const tabs = opt.tabs || []
        const tabTitleArr = []
        const tabContentArr = []
        tabs.forEach((tab, tabIndex) => {
            if (!tab) {
                return
            }
            let title = tab.title || ''
            let tpl = tab.tpl || ''

            // 替换多语言
            title = replaceLang(editor, title)
            tpl = replaceLang(editor, tpl)

            // 添加到 DOM
            const $title = $(`<li class="w-e-item">${title}</li>`)
            $tabTitleContainer.append($title)
            const $content = $(tpl)
            $tabContentContainer.append($content)

            // 记录到内存
            $title._index = tabIndex
            tabTitleArr.push($title)
            tabContentArr.push($content)

            // 设置 active 项
            if (tabIndex === 0) {
                $title._active = true
                $title.addClass('w-e-active')
            } else {
                $content.hide()
            }

            // 绑定 tab 的事件
            $title.on('click', e => {
                if ($title._active) {
                    return
                }
                // 隐藏所有的 tab
                tabTitleArr.forEach($title => {
                    $title._active = false
                    $title.removeClass('w-e-active')
                })
                tabContentArr.forEach($content => {
                    $content.hide()
                })

                // 显示当前的 tab
                $title._active = true
                $title.addClass('w-e-active')
                $content.show()
            })
        })

        // 绑定关闭事件
        $container.on('click', e => {
            // 点击时阻止冒泡
            e.stopPropagation()
        })
        $body.on('click', e => {
            this.hide()
        })

        // 添加到 DOM
        $textContainerElem.append($container)

        // 绑定 opt 的事件，只有添加到 DOM 之后才能绑定成功
        tabs.forEach((tab, index) => {
            if (!tab) {
                return
            }
            const events = tab.events || []
            events.forEach(event => {
                const selector = event.selector
                const type = event.type
                const fn = event.fn || emptyFn
                const $content = tabContentArr[index]
                $content.find(selector).on(type, (e) => {
                    e.stopPropagation()
                    const needToHide = fn(e)
                    // 执行完事件之后，是否要关闭 panel
                    if (needToHide) {
                        this.hide()
                    }
                })
            })
        })

        // focus 第一个 elem
        let $inputs = $container.find('input[type=text],textarea')
        if ($inputs.length) {
            $inputs.get(0).focus()
        }

        // 添加到属性
        this.$container = $container

        // 隐藏其他 panel
        this._hideOtherPanels()
        // 记录该 menu 已经创建了 panel
        _isCreatedPanelMenus.push(menu)
    },

    // 隐藏（移除DOM）
    hide: function () {
        const menu = this.menu
        const $container = this.$container
        if ($container) {
            $container.remove()
        }

        // 将该 menu 记录中移除
        _isCreatedPanelMenus = _isCreatedPanelMenus.filter(item => {
            if (item === menu) {
                return false
            } else {
                return true
            }
        })
    },

    // 一个 panel 展示时，隐藏其他 panel
    _hideOtherPanels: function () {
        if (!_isCreatedPanelMenus.length) {
            return
        }
        _isCreatedPanelMenus.forEach(menu => {
            const panel = menu.panel || {}
            if (panel.hide) {
                panel.hide()
            }
        })
    }
}

export default Panel