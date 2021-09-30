/**
 * @description Menus 菜单栏 入口文件
 * @author wangfupeng
 */

import Editor from '../editor/index'
import Menu from './menu-constructors/Menu'
import MenuConstructorList, { MenuListType } from './menu-list'
import $, { DomElement } from './../utils/dom-core'
// import { MenuActive } from './menu-constructors/Menu'
import ResizeObserver from 'resize-observer-polyfill';
class Menus {
    public editor: Editor
    public menuList: Menu[]
    public constructorList: MenuListType
    private resizeObserver: ResizeObserver
    constructor(editor: Editor) {
        this.editor = editor
        this.menuList = []
        this.constructorList = MenuConstructorList // 所有菜单构造函数的列表
        this.resizeObserver = new ResizeObserver((entries, observer) => {
            const { editor } = this
            this.drawerMode(editor.$toolbarElem)
        });
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

        // 排除自扩展中exclude包含的菜单
        let CustomMenuKeysList: string[] = Object.keys(Editor.globalCustomMenuConstructorList)
        CustomMenuKeysList = CustomMenuKeysList.filter(key => excludeMenus.includes(key))
        CustomMenuKeysList.forEach((key: string) => {
            delete Editor.globalCustomMenuConstructorList[key]
        })

        config.menus.forEach(menuKey => {
            const MenuConstructor = this.constructorList[menuKey] // 暂用 any ，后面再替换
            this._initMenuList(menuKey, MenuConstructor)
        })

        // 全局注册
        for (let [menuKey, menuFun] of Object.entries(Editor.globalCustomMenuConstructorList)) {
            const MenuConstructor = menuFun // 暂用 any ，后面再替换
            this._initMenuList(menuKey, MenuConstructor)
        }


        // 渲染 DOM
        this._addToToolbar(config.toolbarDrawer)
        if (config.showMenuTooltips) {
            // 添加菜单栏tooltips
            this._bindMenuTooltips()
        }
    }

    /**
     * 创建 menu 实例，并放到 menuList 中
     * @param menuKey 菜单 key ，和 editor.config.menus 对应
     * @param MenuConstructor 菜单构造函数
     */
    private _initMenuList(menuKey: String, MenuConstructor: any): void {
        if (MenuConstructor == null || typeof MenuConstructor !== 'function') {
            // 必须是 class
            return
        }
        if (this.menuList.some(menu => menu.key === menuKey)) {
            console.warn('菜单名称重复:' + menuKey)
        } else {
            const m = new MenuConstructor(this.editor)
            m.key = menuKey
            this.menuList.push(m)
        }
    }

    // 绑定菜单栏tooltips
    private _bindMenuTooltips(): void {
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem
        const config = editor.config

        // 若isTooltipShowTop为true则伪元素为下三角，反之为上三角
        const menuTooltipPosition = config.menuTooltipPosition
        const $tooltipEl = $(
            `<div class="w-e-menu-tooltip w-e-menu-tooltip-${menuTooltipPosition}">
            <div class="w-e-menu-tooltip-item-wrapper">
              <div></div>
            </div>
          </div>`
        )

        $tooltipEl.css('visibility', 'hidden')
        $toolbarElem.append($tooltipEl)
        // 设置 z-index
        $tooltipEl.css('z-index', editor.zIndex.get('tooltip'))

        let showTimeoutId: number = 0 // 定时器，延时200ms显示tooltips
        // 清空计时器
        function clearShowTimeoutId() {
            if (showTimeoutId) {
                clearTimeout(showTimeoutId)
            }
        }

        // 隐藏tooltip
        function hide() {
            clearShowTimeoutId()
            $tooltipEl.css('visibility', 'hidden')
        }

        // 事件监听
        $toolbarElem
            .on('mouseover', (e: MouseEvent) => {
                const target = e.target as HTMLElement
                const $target = $(target)
                let title: string | undefined
                let $menuEl: DomElement | undefined

                if ($target.isContain($toolbarElem)) {
                    hide()
                    return
                }

                if ($target.parentUntil('.w-e-droplist') != null) {
                    // 处于droplist中时隐藏
                    hide()
                } else {
                    if ($target.attr('data-title')) {
                        title = $target.attr('data-title')
                        $menuEl = $target
                    } else {
                        const $parent = $target.parentUntil('.w-e-menu')
                        if ($parent != null) {
                            title = $parent.attr('data-title')
                            $menuEl = $parent
                        }
                    }
                }

                if (title && $menuEl) {
                    clearShowTimeoutId()
                    const targetOffset = $menuEl.getOffsetData()
                    $tooltipEl.text(editor.i18next.t('menus.title.' + title))
                    const tooltipOffset = $tooltipEl.getOffsetData()
                    const left =
                        targetOffset.left + targetOffset.width / 2 - tooltipOffset.width / 2
                    $tooltipEl.css('left', `${left}px`)

                    // 2. 高度设置
                    if (menuTooltipPosition === 'up') {
                        $tooltipEl.css('top', `${targetOffset.top - tooltipOffset.height - 8}px`)
                    } else if (menuTooltipPosition === 'down') {
                        $tooltipEl.css('top', `${targetOffset.top + targetOffset.height + 8}px`)
                    }

                    showTimeoutId = window.setTimeout(() => {
                        $tooltipEl.css('visibility', 'visible')
                    }, 200)
                } else {
                    hide()
                }
            })
            .on('mouseleave', () => {
                hide()
            })
    }
    // 添加到菜单栏
    private _addToToolbar(toolbarDrawer: boolean): void {
        const editor = this.editor
        const $toolbarElem = editor.$toolbarElem
        // 遍历添加到 DOM
        if (toolbarDrawer) {
            // 抽屉模式
            this.resizeObserver.observe($toolbarElem.elems[0])
        } else {
            this.batchAppend(this.menuList, $toolbarElem)
        }

    }
    /**
     *开启抽屉模式 
     * @param $toolbarElem 
     */
    private drawerMode($toolbarElem: DomElement) {
        const toolBarWidth = $toolbarElem.getWidth()
        // 判断当前按钮的宽度是否大于编辑器宽度
        if (this.menuList.length * 40 - toolBarWidth > 40) {
            const start = Math.floor((toolBarWidth - 80) / 40)
            const end = this.menuList.length - start
            this.batchAppend(this.menuList.slice(0, start), $toolbarElem)
            const $elem = $(
                `<div class="w-e-menu" data-title="抽屉">
            ...
        </div>`
            )
            $toolbarElem.append(this.drawerBar($elem, ($droplistElem: DomElement) => {
                this.batchAppend(this.menuList.slice(end), $droplistElem)
                return $droplistElem
            }))
        } else {
            this.batchAppend(this.menuList, $toolbarElem)
        }
    }
    /**
     *  绑定抽屉事件并且渲染剩余按钮
     * @param $elem 
     * @returns 
     */
    private drawerBar($elem: DomElement, fn: Function): DomElement {
        const $elemChild = $(
            `<div class="w-e-droplist transverse" style="margin-top:40px;display:none"></div>`)
        $elem.append(fn($elemChild))
        $elemChild.isShow = false
        $elem.on('click', (e: Event) => {
            $elemChild.toggle()
        })
        return $elem
    }

    /**
     * 封装批量渲染menu的dom
     * @param menuList 
     * @param $toolbarElem 
     */
    private batchAppend(menuList: Menu[], $toolbarElem: DomElement) {
        menuList.forEach((menu) => {
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
