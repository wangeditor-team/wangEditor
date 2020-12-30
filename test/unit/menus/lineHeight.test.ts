/**
 * @description lineHeight menu
 * @author lichunlin
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import lineHeight from '../../../src/menus/lineHeight/index'
import { getMenuInstance } from '../../helpers/menus'
import { UA } from '../../../src/utils/util'

let editor: Editor
let lineHeightMenu: lineHeight
let id = 1

describe('LineHeight menu', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
        lineHeightMenu = getMenuInstance(editor, lineHeight) as lineHeight
    })

    test('lineHeight 菜单：dropList', () => {
        expect(lineHeightMenu.dropList).not.toBeNull()
        lineHeightMenu.dropList.show()
        expect(lineHeightMenu.dropList.isShow).toBe(true)
        lineHeightMenu.dropList.hide()
        expect(lineHeightMenu.dropList.isShow).toBe(false)
    })

    test('lineHeight 菜单：增加行高', () => {
        mockCmdFn(document)
        const cmdVal = '2'
        lineHeightMenu.command(cmdVal)
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(editor.$textElem.elems[0]).toContainHTML('<p style="line-height:2;"><br></p>')
    })

    test('lineHeight 菜单：选择多行增加行高', () => {
        mockCmdFn(document)

        editor.txt.html('<p>123</p><p>234</p>')

        const [startNode, endNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, endNode)

        const cmdVal = '2'
        lineHeightMenu.command(cmdVal)
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf('<p style="line-height:2;">123</p>')
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：选择多行增加行高， 如果是IE浏览器，直接返回', () => {
        mockCmdFn(document)

        const mockIE = jest.spyOn(UA, 'isIE')
        mockIE.mockReturnValueOnce(true)

        editor.txt.html('<p>123</p><p>234</p>')

        const [startNode, endNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, endNode)

        const cmdVal = '2'
        lineHeightMenu.command(cmdVal)
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf('<p style="line-height:2;">123</p>')
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：选择多行增加行高， 设置非段落的P标签开头全选', () => {
        mockCmdFn(document)

        editor.txt.html('<p>234<span>123</span></p><div>345</div>')

        const [startNode, endNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, endNode)

        const cmdVal = '2'
        lineHeightMenu.command(cmdVal)
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf(
                '<p style="line-height:2;">234<span>123</span></p>'
            )
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：选择多行增加行高， 设置无P标签的全选，设置无效', () => {
        mockCmdFn(document)

        editor.txt.html('<div>345</div><div>234<span>123</span></div>')

        const [startNode, endNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, endNode)

        const cmdVal = '2'
        lineHeightMenu.command(cmdVal)
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf(
                '<div>345</div><div>234<span>123</span></div>'
            )
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：增加行高， 如果不传value值，则设为默认行高，并且不设置 line-height 样式', () => {
        mockCmdFn(document)

        editor.txt.html('<p style="color:red;">123</p>')

        const [startNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, startNode)

        lineHeightMenu.command('')
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf('<p style="color:red;">123</p>')
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：增加行高， 如果选区的元素有style样式，则会在样式上叠加 line-height 样式', () => {
        mockCmdFn(document)

        editor.txt.html('<p style="color:red;">123</p>')

        const [startNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, startNode)

        lineHeightMenu.command('2')
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf(
                '<p style="color:red;line-height:2;">123</p>'
            )
        ).toBeGreaterThanOrEqual(0)
    })

    test('lineHeight 菜单：增加行高， 如果选区的元素为blockquote元素，则不会叠加 line-height 样式', () => {
        mockCmdFn(document)

        editor.txt.html('<blockquote>123</blockquote>')

        const [startNode] = Array.from(editor.$textElem.elems[0].childNodes)
        lineHeightMenu.setRange(startNode, startNode)

        lineHeightMenu.command('2')
        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.elems[0].innerHTML.indexOf('<blockquote>123</blockquote>')
        ).toBeGreaterThanOrEqual(0)
    })
})
