/**
 * @author 翠林
 * @deprecated 颜色选择器的基类菜单
 */

import Editor from '../../editor'
import ColorPicker from '../../editor/color-picker'
import { UserConfig } from '../../editor/color-picker/types'
import { DomElement } from '../../utils/dom-core'
import Menu from './Menu'

export default class FontColorPicker extends Menu {
    /**
     * 颜色选择器打开的状态
     */
    public opened: boolean

    /**
     * 颜色选择器实例
     */
    public picker: ColorPicker

    /**
     * 调色板菜单
     * @param $elem 菜单节点
     * @param editor 编辑器实例
     * @param config 颜色选择器的配置。优先级：基类中公共配置 >> 继承基类的类的配置 >> editor.config.colorPicker 配置。
     */
    public constructor($elem: DomElement, editor: Editor, config: UserConfig) {
        super($elem, editor)
        this.opened = false

        // i18next
        function t(name: string) {
            return editor.i18next.t(`colorPicker.${name}`)
        }

        // 初始化颜色选择器
        this.picker = ColorPicker.create(
            Object.assign({ ...editor.config.colorPicker }, config, {
                append: $elem,
                builtInTitle: t('内置颜色列表'),
                historyTitle: t('最近使用的颜色'),
                customTitle: t('自定义颜色列表'),
                text: {
                    toPalette: t('调色板'),
                    toSelect: t('颜色列表'),
                    done: t('确定'),
                    cancel: t('取消'),
                    empty: t('无'),
                },
                // 颜色选择器关闭
                closed: () => {
                    $elem.css('z-index', 'auto')
                    this.opened = false
                },
            })
        )

        // 配置颜色选择器的 z-index
        this.picker.css('z-index', editor.zIndex.get('panel'))

        // 显示颜色选择器的回调函数
        let show = () => {
            const height = $elem.getBoundingClientRect().height
            this.picker.css('margin-top', `${height}px`)
            // 重写 show 函数
            show = () => {
                this.picker.show()
                this.opened = true
            }
            show()
        }

        // 绑定菜单的鼠标悬浮事件
        $elem.on('mouseenter', () => {
            if (editor.selection.getRange() !== null && !this.opened) {
                editor.txt.eventHooks.dropListMenuHoverEvents.forEach(fn => fn())
                $elem.css('z-index', editor.zIndex.get('menu'))
                show()
            }
        })

        // 隐藏颜色选择器的回调函数
        const hide = () => {
            this.picker.hide()
        }

        // 将函数加入对应的钩子中
        this.editor.txt.eventHooks.clickEvents.push(hide)
        this.editor.txt.eventHooks.menuClickEvents.push(hide)
        this.editor.txt.eventHooks.toolbarClickEvents.push(hide)
        this.editor.txt.eventHooks.dropListMenuHoverEvents.push(hide)
    }
}
