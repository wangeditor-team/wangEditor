/**
 * @description Menus 菜单栏 入口文件
 * @author wangfupeng
 */

import $ from '../utils/dom-core'
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
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem
        // 从用户配置的 menus 入手，看需要初始化哪些菜单
        const config = this.editor.config
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

        // 添加菜单栏tooltips
        function addMenuTooltips() {
            $toolbarElem.children()?.forEach(ele => {
                const $elem = $(ele)
                const title: string | undefined = $elem.attr('data-title')
                // 有title时才创建tooltips
                if (title) {
                    // 创建 tooltip
                    const $container = $(
                        `<div class="w-e-menu-tooltip w-e-menu-tooltip-up">
                          <div class="w-e-menu-tooltip-item-wrapper">
                            <div>${editor.i18next.t('menus.title.' + title)}</div>
                          </div>
                        </div>`
                    )
                    const menuHeight = $elem.getSizeData().height || 0
                    $container.css('margin-top', menuHeight * -1 + 'px')
                    $container.hide()
                    $elem.append($container)

                    // 设置 z-index
                    $container.css('z-index', editor.zIndex.get('tooltip'))

                    let showTimeoutId: number = 0 // 定时器，延时200ms显示tooltips
                    $elem
                        .on('mouseenter', () => {
                            showTimeoutId = window.setTimeout(() => {
                                $container.show()
                            }, 200)
                        })
                        .on('mouseleave', () => {
                            if (showTimeoutId) {
                                clearTimeout(showTimeoutId)
                            }
                            $container.hide()
                        })
                }
            })
        }
        // 鼠标悬停提示
        $toolbarElem.on('mouseenter', addMenuTooltips)
        // 解绑事件
        $toolbarElem.on('mouseleave', () => {
            $toolbarElem.off('mouseenter', addMenuTooltips)
        })
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
