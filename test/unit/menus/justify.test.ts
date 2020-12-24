/**
 * @description justify menu
 * @author liuwei
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import justify from '../../../src/menus/justify/index'
import $ from '../../../src/utils/dom-core'
import { DomElement } from '../../../src/utils/dom-core'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let justifyMenu: justify

test('justify 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    justifyMenu = getMenuInstance(editor, justify) as justify // 赋值给全局变量
    expect(justifyMenu.dropList).not.toBeNull()
    justifyMenu.dropList.show()
    expect(justifyMenu.dropList.isShow).toBe(true)
    justifyMenu.dropList.hide()
    expect(justifyMenu.dropList.isShow).toBe(false)
})

test('justify 菜单：设置对齐方式', () => {
    type justifyType = {
        [key: string]: string
    }
    const justifyClass: justifyType = {
        justifyLeft: 'left',
        justifyCenter: 'center',
        justifyRight: 'right',
        justifyFull: 'justify',
    }
    const mockGetSelectionRangeTopNodes = (tagString: string) => {
        const domArr = [$(tagString)]
        jest.spyOn(editor.selection, 'getSelectionRangeTopNodes').mockImplementation(() => domArr)
        return domArr
    }
    const $elems = mockGetSelectionRangeTopNodes('<p>123</p>')
    for (let key in justifyClass) {
        justifyMenu.command(key)
        $elems.forEach((el: DomElement) => {
            expect(el.elems[0].getAttribute('style')).toContain(`text-align:${justifyClass[key]}`)
        })
    }
})
