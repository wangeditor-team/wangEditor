/**
 * @description split-line menu
 * @author luochao
 */
import createEditor from '../../helpers/create-editor'
import mockCommand from '../../helpers/command-mock'
import SplitLine from '../../../src/menus/split-line'
import { getMenuInstance } from '../../helpers/menus'
import $ from '../../../src/utils/dom-core'

let editor: ReturnType<typeof createEditor>
let splitLineMenu: SplitLine
let id = 1

describe('split-line menu', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
        splitLineMenu = getMenuInstance(editor, SplitLine)
    })

    test('初始化编辑器默认会创建 split-line 菜单', () => {
        expect(splitLineMenu).not.toBeNull()
    })

    test('点击分割线菜单会创建分割线', () => {
        mockCommand(document)

        splitLineMenu.clickHandler()

        expect((editor.txt.html() as string).indexOf('<hr/>')).toBeGreaterThanOrEqual(0)
    })

    test('执行 splitLineEvents 里面的钩子函数会展示 tooltip 菜单，点击其它地方会隐藏tooptip', () => {
        mockCommand(document)

        editor.txt.eventHooks.splitLineEvents.forEach(fn => {
            fn(splitLineMenu.$elem)
        })

        const tooltip1 = $('.w-e-tooltip')

        expect(tooltip1.elems[0]).not.toBeUndefined()

        editor.$textElem.elems[0].click()

        const tooltip2 = $('.w-e-tooltip')
        expect(tooltip2.elems[0]).toBeUndefined()
    })

    test('执行 splitLineEvents 里面的钩子函数会展示 tooltip 菜单，点击tooltip删除按钮会移除分隔线', () => {
        mockCommand(document)

        splitLineMenu.clickHandler()

        expect((editor.txt.html() as string).indexOf('<hr/>')).toBeGreaterThanOrEqual(0)

        editor.txt.eventHooks.splitLineEvents.forEach(fn => {
            fn(splitLineMenu.$elem)
        })

        const tooltip = $('.w-e-tooltip')
        expect(tooltip.elems[0]).not.toBeUndefined()

        const deleteSpan = tooltip.find('.w-e-tooltip-item-wrapper span')
        deleteSpan.elems[0].click()

        expect(document.execCommand).toBeCalledWith('delete', false, undefined)
    })
})
