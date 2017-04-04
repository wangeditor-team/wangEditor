/*
    菜单集合
*/
import { objForEach } from '../util/util.js'

// 存储菜单的构造函数
const MenuConstructors = {}

// 引入所有的菜单，并记录
import Bold from './bold.js'
MenuConstructors.bold = Bold

import Head from './head.js'
MenuConstructors.head = Head

import Link from './link.js'
MenuConstructors.link = Link


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
        objForEach(menus, (key, menu) => {
            const $elem = menu.$elem
            if ($elem) {
                $toolbarElem.append($elem)
            }
        })
    },

    // 绑定菜单 click mouseenter 事件
    _bindEvent: function () {

    },

    // 尝试修改菜单状态
    changeActive: function () {

    }
}

export default Menus