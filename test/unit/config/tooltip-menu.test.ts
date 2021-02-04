/**
 * @description tooltip menu test
 * @author raosiling
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import dispatchEvent from '../../helpers/mock-dispatch-event'
import $ from '../../../src/utils/dom-core'

let editor: Editor
let editor2: Editor

describe('tooltip menu', () => {
    test('初始化编辑器', () => {
        editor = createEditor(document, 'div1') // 赋值全局变量
        expect(editor.txt).not.toBeNull()
    })
    test('模拟菜单显示隐藏tooltip', done => {
        const $tooltip = $(editor.$toolbarElem).find('.w-e-menu-tooltip')
        expect($tooltip.elems[0]).toHaveStyle(`visibility:hidden`)

        const toolbarSelector = editor.$toolbarElem.elems[0].className
        const BoldMenuEl = $(`.${toolbarSelector}`).find('.w-e-icon-bold')
        dispatchEvent(BoldMenuEl, 'mouseover', 'MouseEvent')

        setTimeout(() => {
            expect($tooltip.elems[0]).toHaveStyle(`visibility:visible`)
            expect($tooltip.text()).toEqual('加粗')
            // 移出隐藏
            dispatchEvent(editor.$toolbarElem, 'mouseleave', 'MouseEvent')
            setTimeout(() => {
                expect($tooltip.elems[0]).toHaveStyle(`visibility:hidden`)
            }, 20)
            done()
        }, 300)
    })
})

describe('tooltip配置', () => {
    test('关闭显示tooltip', () => {
        editor2 = createEditor(document, 'div2', '', { showMenuTooltips: false })
        expect(editor2.txt).not.toBeNull()
        const tooltipMenuEl = $(editor2.$toolbarElem).find('.w-e-menu-tooltip')
        expect(tooltipMenuEl.length).toBe(0)
    })
})
