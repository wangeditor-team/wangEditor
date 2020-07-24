/**
 * @description 自定义菜单 测试
 * @author wangfupeng
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import BtnMenu from '../../src/menus/menu-constructors/BtnMenu'

let editor: Editor

// 创建 menu 的各个 class
test('E.menuConstructors 中的 class', () => {
    const { BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = Editor.menuConstructors

    expect(BtnMenu).not.toBeNull()
    expect(DropListMenu).not.toBeNull()
    expect(PanelMenu).not.toBeNull()
    expect(DropList).not.toBeNull()
    expect(Panel).not.toBeNull()
    expect(Tooltip).not.toBeNull()

    expect(Editor.$).not.toBeNull()
})

test('扩展一个菜单', () => {
    // 创建 class
    class InsertABCMenu extends BtnMenu {
        constructor(editor: Editor) {
            const $elem = Editor.$(
                `<div class="w-e-menu">
                    <button>ABC</button>
                </div>`
            )
            super($elem, editor)
        }
        // 菜单点击事件
        clickHandler() {}
        // 菜单激活状态
        tryChangeActive() {}
    }

    // 创建编辑器实例
    editor = createEditor(document, 'div1') // 赋值给全局变量，便于再扩展测试用例
    // 注册菜单
    editor.menus.extend('insertABC', InsertABCMenu)

    expect(editor.menus.constructorList.insertABC).not.toBeNull()
})
