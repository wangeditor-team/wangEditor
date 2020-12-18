/**
 * @description editor.text event-hooks del-to-keep-p test
 * @author luochao
 */
import delToKeepP from '../../../src/text/event-hooks/del-to-keep-p'
import createEditor from '../../helpers/create-editor'

describe('editor.text event-hooks tab-to-space test', () => {
    test('能绑定分别绑定 一个处理 up 和 down 的函数', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []
        const editor = createEditor(document, 'div1')

        delToKeepP(editor, upFns, downFns)

        expect(upFns.length).toBe(1)
        expect(downFns.length).toBe(1)
    })

    test('当编辑器内容为空时，执行 up 函数，则会插入 <p><br></p> 内容', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []
        const editor = createEditor(document, 'div2')

        delToKeepP(editor, upFns, downFns)

        editor.txt.html(' ')

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual('<p><br></p>')
    })

    test('当编辑器内容只有 <br> 时，执行 up 函数，则会插入 <p><br></p> 内容', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []
        const editor = createEditor(document, 'div3')

        delToKeepP(editor, upFns, downFns)

        editor.txt.html('<br>')

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual(' <p><br></p>')
    })

    test('当编辑器内容清空到只剩下 <p><br></p> 内容时，则不允许再删除', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []
        const editor = createEditor(document, 'div4')

        delToKeepP(editor, upFns, downFns)

        editor.txt.html('<p><br></p>')

        const e = new KeyboardEvent('mousedown')
        const mockPreventDefault = jest.fn()
        jest.spyOn(e, 'preventDefault').mockImplementation(mockPreventDefault)

        downFns.forEach(fn => {
            fn(e)
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual('<p><br></p>')
        expect(mockPreventDefault).toBeCalled()
    })
})
