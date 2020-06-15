/**
 * @description Menus 菜单栏 入口文件
 * @author wangfupeng
 */

import Editor from '../editor/index'
import Menu from './menu-constructors/Menu'
import MenuConstructorList from './menu-list'
// import { MenuActive } from './menu-constructors/Menu'

class Menus {
    public editor: Editor
    public menuList: Menu[]

    constructor(editor: Editor) {
        this.editor = editor
        this.menuList = []
    }

    // 初始化菜单
    public init(): void {
        // 从用户配置的 menus 入手，看需要初始化哪些菜单
        const config = this.editor.config
        config.menus.forEach(menuKey => {
            const MenuConstructor = (MenuConstructorList as any)[menuKey] // 暂用 any ，后面再替换
            if (MenuConstructor == null) {
                return
            }
            // 创建 menu 实例，并放到 menuList 中
            const m = new MenuConstructor(this.editor)
            this.menuList.push(m)
        })

        // 渲染 DOM
        this._addToToolbar()
    }

    // 添加到菜单栏
    private _addToToolbar(): void {
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem
        const config = editor.config
        // config.zIndex 是配置的编辑区域的 z-index，菜单的 z-index 得在其基础上 +1
        const zIndex = config.zIndex + 1

        // 遍历添加到 DOM
        this.menuList.forEach(menu => {
            const $elem = menu.$elem
            if ($elem) {
                // 设置 z-index
                $elem.css('z-index', zIndex)
                $toolbarElem.append($elem)
            }
        })
    }

    /**
     * @description 修改菜单激活状态
     */
    public changeActive(): void {
        this.menuList.forEach(menu => {
            setTimeout((menu as any).tryChangeActive.bind(menu), 100) // 暂用 any ，后面再替换
        })
    }
}

export default Menus
