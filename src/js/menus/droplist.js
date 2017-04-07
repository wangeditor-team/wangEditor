/*
    droplist
*/
import $ from '../util/dom-core.js'

const _emptyFn = () => {}

// 构造函数
function DropList(menu, opt) {
    // droplist 所依附的菜单
    this.menu = menu
    this.opt = opt
    // 容器
    const $container = $('<div class="w-e-droplist"></div>')

    // 标题
    const $title = opt.$title
    if ($title) {
        $title.addClass('w-e-dp-title')
        $container.append($title)
    }

    const list = opt.list || []
    const onClick = opt.onClick || _emptyFn

    // 加入 DOM 并绑定事件
    const $list = $('<ul></ul>')
    $container.append($list)
    list.forEach(item => {
        const $elem = item.$elem
        const value = item.value
        if ($elem) {
            $list.append($elem)
            $elem.on('click', e => {
                onClick(value)

                // 隐藏
                this.hideTimeoutId = setTimeout(() => {
                    this.hide()
                }, 200)
            })
        }
    })

    // 绑定隐藏事件
    $container.on('mouseleave', e => {
        this.hideTimeoutId = setTimeout(() => {
            this.hide()
        }, 200)
    })

    // 记录属性
    this.$container = $container

    // 基本属性
    this._rendered = false
    this._show = false
}

// 原型
DropList.prototype = {
    constructor: DropList,

    // 显示（插入DOM）
    show: function () {
        if (this.hideTimeoutId) {
            // 清除之前的定时隐藏
            clearTimeout(this.hideTimeoutId)
        }

        const menu = this.menu
        const $menuELem = menu.$elem
        const $container = this.$container
        if (this._show) {
            return
        }
        if (this._rendered) {
            // 显示
            $container.show()
        } else {
            // 加入 DOM 之前先定位位置
            const menuHeight = $menuELem.getSizeData().height || 0
            const width = this.opt.width || 100  // 默认为 100
            $container.css('margin-top', menuHeight + 'px')
                    .css('width', width + 'px')

            // 加入到 DOM
            $menuELem.append($container)
            this._rendered = true
        }

        // 修改属性
        this._show = true
    },

    // 隐藏（移除DOM）
    hide: function () {
        if (this.showTimeoutId) {
            // 清除之前的定时显示
            clearTimeout(this.showTimeoutId)
        }

        const $container = this.$container
        if (!this._show) {
            return
        }
        // 隐藏并需改属性
        $container.hide()
        this._show = false
    }
}

export default DropList