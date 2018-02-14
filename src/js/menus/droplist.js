/*
    droplist
*/
import $ from '../util/dom-core.js'
import replaceLang from '../util/replace-lang.js'

const _emptyFn = () => {}

// 构造函数
function DropList(menu, opt) {
    // droplist 所依附的菜单
    const editor = menu.editor
    this.menu = menu
    this.opt = opt
    // 容器
    const $container = $('<div class="w-e-droplist"></div>')

    // 标题
    const $title = opt.$title
    let titleHtml
    if ($title) {
        // 替换多语言
        titleHtml = $title.html()
        titleHtml = replaceLang(editor, titleHtml)
        $title.html(titleHtml)

        $title.addClass('w-e-dp-title')
        $container.append($title)
    }

    const list = opt.list || []
    const type = opt.type || 'list'  // 'list' 列表形式（如“标题”菜单） / 'inline-block' 块状形式（如“颜色”菜单）
    const onClick = opt.onClick || _emptyFn

    // 加入 DOM 并绑定事件
    const $list = $('<ul class="' + (type === 'list' ? 'w-e-list' : 'w-e-block') + '"></ul>')
    $container.append($list)
    list.forEach(item => {
        const $elem = item.$elem

        // 替换多语言
        let elemHtml = $elem.html()
        elemHtml = replaceLang(editor, elemHtml)
        $elem.html(elemHtml)

        const value = item.value
        const $li = $('<li class="w-e-item"></li>')
        if ($elem) {
            $li.append($elem)
            $list.append($li)
            $li.on('click', e => {
                onClick(value)

                // 隐藏
                this.hideTimeoutId = setTimeout(() => {
                    this.hide()
                }, 0)
            })
        }
    })

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