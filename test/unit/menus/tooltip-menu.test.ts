/**
 * @description tooltip menu test
 * @author raosiling
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import dispatchEvent from '../../helpers/mock-dispatch-event'
import $, { DomElement } from '../../../src/utils/dom-core'

let editor: Editor
let $children: DomElement

describe('tooltip menu', () => {
    test('初始化编辑器', () => {
        editor = createEditor(document, 'div1') // 赋值全局变量
        expect(editor.txt).not.toBeNull()
    })
    test('模拟菜单mouseenter事件显示tooltip,mouseleave事件隐藏tooltip', done => {
        $children = $(editor.$toolbarElem.elems[0])
        dispatchEvent(editor.$toolbarElem, 'mouseenter', 'MouseEvent')
        dispatchEvent($children, 'mouseenter', 'MouseEvent')

        setTimeout(() => {
            expect($children.find('.w-e-menu-tooltip')).not.toBeNull
            // 提示内容是否一致
            const title = $children.attr('data-title')
            expect($children.text(title)).not.toBeNull
            expect(editor.$toolbarElem.elems[0]).toHaveStyle(`display:block`)

            // 移出隐藏
            dispatchEvent($children, 'mouseleave', 'MouseEvent')
            dispatchEvent(editor.$toolbarElem, 'mouseleave', 'MouseEvent')
            setTimeout(() => {
                expect(editor.$toolbarElem.elems[0]).toHaveStyle(`display:none`)
                done()
            }, 200)
            done()
        }, 300)
    })
})
