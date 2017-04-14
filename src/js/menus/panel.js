/*
    panel
*/

import $ from '../util/dom-core.js'
const emptyFn = () => {}

// 构造函数
function Panel(menu, opt) {
    this.menu = menu
    this.opt = opt

    // 状态
    this._show = false
}

// 原型
Panel.prototype = {
    constructor: Panel,

    // 显示（插入DOM）
    show: function () {
        if (this._show) {
            return
        }

        const menu = this.menu
        const editor = menu.editor
        const $textContainerElem = editor.$textContainerElem
        const opt = this.opt

        // panel 的容器
        const $container = $('<div class="w-e-panel-container"></div>')
        const width = opt.width || 300 // 默认 300px
        const height = opt.height || 150 // 默认 100px
        $container.css('width', width + 'px')
                .css('height', height + 'px')
                .css('margin-left', (0 - width)/2 + 'px')

        // 准备 tabs 容器
        const $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>')
        const $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>')
        $container.append($tabTitleContainer).append($tabContentContainer)
        
        // tabs
        const tabs = opt.tabs || []
        const tabTitleArr = []
        const tabContentArr = []
        tabs.forEach((tab, tabIndex) => {
            const title = tab.title || ''
            const tpl = tab.tpl || ''

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
        $textContainerElem.on('click', e => {
            this.hide()
        })

        // 添加到 DOM
        $textContainerElem.append($container)

        // 绑定 opt 的事件，只有添加到 DOM 之后才能绑定成功
        tabs.forEach((tab) => {
            const events = tab.events || []
            events.forEach(event => {
                const selector = event.selector
                const type = event.type
                const fn = event.fn || emptyFn
                $container.find(selector).on(type, (e) => {
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
        this._show = true
    },

    // 隐藏（移除DOM）
    hide: function () {
        if (!this._show) {
            return
        }
        const $container = this.$container
        $container.remove()
        this._show = false
    }
}

export default Panel