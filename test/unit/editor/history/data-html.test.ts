/**
 * @description Editor history data html cache
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import Editor from '../../../../src/editor'
import HtmlCache from '../../../../src/editor/history/data/html'

let editor: Editor
let htmlCache: HtmlCache
describe('Editor history html cache', () => {
    beforeEach(() => {
        editor = createEditor(document, 'div1', '', {
            compatibleMode: () => true,
        })

        htmlCache = new HtmlCache(editor)

        htmlCache.observe()
    })

    test('可以使用 HtmlCache 实现编辑器内容撤回', () => {
        const testHtml1 = '<span>123</span>'
        const testHtml2 = '<h1>456</h1>'

        editor.txt.html(testHtml1)

        expect(editor.$textElem.elems[0]).toContainHTML(testHtml1)

        htmlCache.save()

        editor.txt.html(testHtml2)

        expect(editor.$textElem.elems[0]).toContainHTML(testHtml2)

        htmlCache.save()

        htmlCache.revoke()

        expect(editor.$textElem.elems[0]).toContainHTML(testHtml1)
    })

    test('可以使用 HtmlCache 撤回编辑器内容，撤回后还可以恢复', () => {
        const testHtml1 = '<span>123</span>'
        const testHtml2 = '<h1>456</h1>'

        editor.txt.html(testHtml1)

        htmlCache.save()

        expect(editor.$textElem.elems[0]).toContainHTML(testHtml1)

        editor.txt.html(testHtml2)

        htmlCache.save()

        const revokeRes = htmlCache.revoke()

        expect(revokeRes).toBeTruthy()
        expect(editor.$textElem.elems[0]).not.toContainHTML(testHtml2)

        const restoreRes = htmlCache.restore()
        expect(restoreRes).toBeTruthy()
        expect(editor.$textElem.elems[0]).toContainHTML(testHtml2)
    })

    test('没有内容撤回时，调用revoke返回false', () => {
        const testHtml1 = '<span>123</span>'

        editor.txt.html(testHtml1)

        const res = htmlCache.revoke()
        expect(res).toBeFalsy()
    })

    test('没有内容恢复时，调用restore返回false', () => {
        const testHtml1 = '<span>123</span>'

        editor.txt.html(testHtml1)

        const res = htmlCache.restore()
        expect(res).toBeFalsy()
    })
})
