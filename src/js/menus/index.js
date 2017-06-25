/*
    菜单集合
*/
import { objForEach } from '../util/util.js'
import MenuConstructors from './menu-list.js'

// 构造函数
function Menus(editor) {
    this.editor = editor
    this.menus = {}
}

// 修改原型
Menus.prototype = {
    constructor: Menus,

    // 初始化菜单
    init: function () {
        const editor = this.editor
        const config = editor.config || {}
        const configMenus = config.menus || []  // 获取配置中的菜单

        // 根据配置信息，创建菜单
        configMenus.forEach(menuKey => {
            const MenuConstructor = MenuConstructors[menuKey]
            if (MenuConstructor && typeof MenuConstructor === 'function') {
                // 创建单个菜单
                this.menus[menuKey] = new MenuConstructor(editor)
            }
        })

        // 添加到菜单栏
        this._addToToolbar()

        // 绑定事件
        this._bindEvent()
    },

    // 添加到菜单栏
    _addToToolbar: function () {
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem
        const menus = this.menus
        const config = editor.config
        // config.zIndex 是配置的编辑区域的 z-index，菜单的 z-index 得在其基础上 +1
        const zIndex = config.zIndex + 1
        objForEach(menus, (key, menu) => {
            const $elem = menu.$elem
            if ($elem) {
                // 设置 z-index
                $elem.css('z-index', zIndex)
                $toolbarElem.append($elem)
            }
        })
    },

    // 绑定菜单 click mouseenter 事件
    _bindEvent: function () {
        const menus = this.menus
        const editor = this.editor
        objForEach(menus, (key, menu) => {
            const type = menu.type
            if (!type) {
                return
            }
            const $elem = menu.$elem
            const droplist = menu.droplist
            const panel = menu.panel

            // 点击类型，例如 bold
            if (type === 'click' && menu.onClick) {
                $elem.on('click', e => {
                    if (editor.selection.getRange() == null) {
                        return
                    }
                    menu.onClick(e)
                })
            }

            // 下拉框，例如 head
            if (type === 'droplist' && droplist) {
                $elem.on('mouseenter', e => {
                    if (editor.selection.getRange() == null) {
                        return
                    }
                    // 显示
                    droplist.showTimeoutId = setTimeout(() => {
                        droplist.show()
                    }, 200)
                }).on('mouseleave', e => {
                    // 隐藏
                    droplist.hideTimeoutId = setTimeout(() => {
                        droplist.hide()
                    }, 0)
                })
            }

            // 弹框类型，例如 link
            if (type === 'panel' && menu.onClick) {
                $elem.on('click', e => {
                    e.stopPropagation()
                    if (editor.selection.getRange() == null) {
                        return
                    }
                    // 在自定义事件中显示 panel
                    menu.onClick(e)
                })
            }
        })
    },

    // 尝试修改菜单状态
    changeActive: function () {
        const menus = this.menus
        objForEach(menus, (key, menu) => {
            if (menu.tryChangeActive) {
                setTimeout(() => {
                    menu.tryChangeActive()
                }, 100)
            }
        })
    }
}

export default Menus