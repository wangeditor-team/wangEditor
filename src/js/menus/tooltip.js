/*
    tooltip
*/
import $ from '../util/dom-core.js'
import replaceLang from '../util/replace-lang.js'

// 构造函数
function tooltip(menu, opt) {
    // tooltip 所依附的菜单
    const editor = menu.editor
    this.menu = menu
    this.opt = opt
    // 容器
    const $container = $('<div class="w-e-tooltip"></div>')

    // 内容
    const $content = opt.$content
    let contentHtml
    if ($content) {
        // 替换多语言
        contentHtml = $content.html()
        contentHtml = replaceLang(editor, contentHtml)
        $content.html(contentHtml)

        $container.append($content)
    }

    // 绑定隐藏事件
    $container.on('mouseleave', e => {
        this.hideTimeoutId = setTimeout(() => {
            this.hide()
        }, 0)
    })

    // 记录属性
    this.$container = $container

    // 基本属性
    this._rendered = false
    this._show = false
}

// 原型
tooltip.prototype = {
    constructor: tooltip,

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
            $container.css('margin-top', menuHeight + 'px')

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

export default tooltip
