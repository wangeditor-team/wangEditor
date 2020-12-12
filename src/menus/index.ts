/**
 * @description Menus 菜单栏 入口文件
 * @author wangfupeng
 */

import Editor from '../editor/index'
import Menu from './menu-constructors/Menu'
import MenuConstructorList, { MenuListType } from './menu-list'

// import { MenuActive } from './menu-constructors/Menu'

class Menus {
    public editor: Editor
    public menuList: Menu[]
    public constructorList: MenuListType

    constructor(editor: Editor) {
        this.editor = editor
        this.menuList = []
        this.constructorList = MenuConstructorList // 所有菜单构造函数的列表
    }

    /**
     * 自定义添加菜单
     * @param key 菜单 key ，和 editor.config.menus 对应
     * @param Menu 菜单构造函数
     */
    public extend(key: string, Menu: any) {
        if (!Menu || typeof Menu !== 'function') return
        this.constructorList[key] = Menu
    }

    // 初始化菜单
    public init(): void {
        // 从用户配置的 menus 入手，看需要初始化哪些菜单
        const config = this.editor.config

        // 排除exclude包含的菜单
        let excludeMenus: string[] | any = config.excludeMenus
        if (Array.isArray(excludeMenus) === false) excludeMenus = []
        config.menus = config.menus.filter(key => excludeMenus.includes(key) === false)

        config.menus.forEach(menuKey => {
            const MenuConstructor = this.constructorList[menuKey] // 暂用 any ，后面再替换
            if (MenuConstructor == null || typeof MenuConstructor !== 'function') {
                // 必须是 class
                return
            }
            // 创建 menu 实例，并放到 menuList 中
            const m = new MenuConstructor(this.editor)
            m.key = menuKey
            this.menuList.push(m)
        })

        // 渲染 DOM
        this._addToToolbar()
    }

    // 添加到菜单栏
    private _addToToolbar(): void {
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem

        // 遍历添加到 DOM
        this.menuList.forEach(menu => {
            const $elem = menu.$elem
            if ($elem) {
                $toolbarElem.append($elem)
            }
        })
    }

    /**
     * 获取菜单对象
     * @param 菜单名称 小写
     * @return Menus 菜单对象
     */
    public menuFind(key: string): Menu {
        const menuList = this.menuList
        for (let i = 0, l = menuList.length; i < l; i++) {
            if (menuList[i].key === key) return menuList[i]
        }

        return menuList[0]
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
