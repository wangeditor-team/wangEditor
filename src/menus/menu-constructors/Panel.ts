/**
 * @description panel class
 * @author wangfupeng
 */

import $, { DomElement } from '../../utils/dom-core'
import PanelMenu from './PanelMenu'
import { EMPTY_FN } from '../../utils/const'

// 记录已经创建过的 panel
const CREATED_MENUS = new Set()

// Panel 配置格式
type _TabEventConf = {
    selector: string
    type: string
    fn: Function
}
export type PanelTabConf = {
    title: string
    tpl: string
    events: _TabEventConf[]
}
export type PanelConf = {
    width: number | 0
    height: number | 0
    tabs: PanelTabConf[]
}

class Panel {
    private menu: PanelMenu
    private conf: PanelConf
    public $container: DomElement

    constructor(menu: PanelMenu, conf: PanelConf) {
        this.menu = menu
        this.conf = conf
        this.$container = $('<div class="w-e-panel-container"></div>')
    }

    /**
     * 创建并展示 panel
     */
    public create(): void {
        const menu = this.menu
        if (CREATED_MENUS.has(menu)) {
            // 创建过了
            return
        }

        const editor = menu.editor
        const $body = $('body')
        const $textContainerElem = editor.$textContainerElem
        const conf = this.conf

        // panel 的容器
        const $container = this.$container
        const width = conf.width || 300 // 默认 300px
        $container.css('width', width + 'px').css('margin-left', (0 - width) / 2 + 'px')

        // 添加关闭按钮
        const $closeBtn = $('<i class="w-e-icon-close w-e-panel-close"></i>')
        $container.append($closeBtn)
        $closeBtn.on('click', () => {
            this.remove()
        })

        // 准备 tabs 容器
        const $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>')
        const $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>')
        $container.append($tabTitleContainer).append($tabContentContainer)

        // 设置高度
        const height = conf.height // height: 0 即不用设置
        if (height) {
            $tabContentContainer.css('height', height + 'px').css('overflow-y', 'auto')
        }

        // tabs
        const tabs = conf.tabs || []
        const tabTitleArr: DomElement[] = []
        const tabContentArr: DomElement[] = []

        tabs.forEach((tab: PanelTabConf, tabIndex: number) => {
            if (!tab) {
                return
            }
            const title = tab.title || ''
            const tpl = tab.tpl || ''

            // 添加到 DOM
            const $title = $(`<li class="w-e-item">${title}</li>`)
            $tabTitleContainer.append($title)
            const $content = $(tpl)
            $tabContentContainer.append($content)

            // 记录到内存
            tabTitleArr.push($title)
            tabContentArr.push($content)

            // 设置 active 项
            if (tabIndex === 0) {
                $title.data('active', true)
                $title.addClass('w-e-active')
            } else {
                $content.hide()
            }

            // 绑定 tab 的事件
            $title.on('click', () => {
                if ($title.data('active')) {
                    return
                }
                // 隐藏所有的 tab
                tabTitleArr.forEach($title => {
                    $title.data('active', false)
                    $title.removeClass('w-e-active')
                })
                tabContentArr.forEach($content => {
                    $content.hide()
                })

                // 显示当前的 tab
                $title.data('active', true)
                $title.addClass('w-e-active')
                $content.show()
            })
        })

        // 绑定关闭事件
        $container.on('click', (e: Event) => {
            // 点击时阻止冒泡
            e.stopPropagation()
        })
        $body.on('click', () => {
            this.remove()
        })

        // 添加到 DOM
        $textContainerElem.append($container)

        // 绑定 conf events 的事件，只有添加到 DOM 之后才能绑定成功
        tabs.forEach((tab: PanelTabConf, index: number) => {
            if (!tab) {
                return
            }
            const events = tab.events || []
            events.forEach((event: _TabEventConf) => {
                const selector = event.selector
                const type = event.type
                const fn = event.fn || EMPTY_FN
                const $content = tabContentArr[index]
                $content.find(selector).on(type, (e: Event) => {
                    e.stopPropagation()
                    const needToHide = fn(e)
                    // 执行完事件之后，是否要关闭 panel
                    if (needToHide) {
                        this.remove()
                    }
                })
            })
        })

        // focus 第一个 elem
        let $inputs = $container.find('input[type=text],textarea')
        if ($inputs.length) {
            $inputs.get(0).focus()
        }

        // 隐藏其他 panel
        this.hideOtherPanels()

        // 记录该 menu 已经创建了 panel
        CREATED_MENUS.add(menu)
    }

    /**
     * 移除 penal
     */
    public remove(): void {
        const menu = this.menu
        const $container = this.$container
        if ($container) {
            $container.remove()
        }

        // 将该 menu 记录中移除
        CREATED_MENUS.delete(menu)
    }

    /**
     * 隐藏其他 panel
     */
    private hideOtherPanels(): void {
        if (CREATED_MENUS.size === 0) {
            return
        }
        CREATED_MENUS.forEach(menu => {
            const panel = (menu as PanelMenu).panel
            panel && panel.remove()
        })
    }
}

export default Panel
