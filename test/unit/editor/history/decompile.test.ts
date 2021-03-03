/**
 * @description history decompile
 * @author luochao
 */

import createEditor from '../../../helpers/create-editor'
import Editor from '../../../../src/editor'
import compile from '../../../../src/editor/history/data/node/compile'
import { restore, revoke } from '../../../../src/editor/history/data/node/decompilation'
import { EMPTY_P } from '../../../../src/utils/const'

let editor: Editor

describe('Editor history decompile', () => {
    beforeEach(() => {
        editor = createEditor(document, 'div1')
    })

    test('可以通过revoke方法撤销编辑器设置的html', done => {
        expect.assertions(3)

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)

            expect(compileData instanceof Array).toBeTruthy()
            expect(compileData.length).toBe(1)

            observer.disconnect()

            revoke(compileData)

            expect(editor.$textElem.html()).toEqual(EMPTY_P)
            done()
        })

        const $textEl = editor.$textElem.elems[0]
        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        editor.txt.html('<span>123</span>')
    })

    test('可以通过revoke方法撤销编辑器设置的属性', done => {
        expect.assertions(3)

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)

            expect(compileData instanceof Array).toBeTruthy()
            expect(compileData.length).toBe(1)

            observer.disconnect()

            revoke(compileData)

            expect(editor.$textElem.html()).toEqual('<span>123</span>')
            done()
        })

        const $textEl = editor.$textElem.elems[0]

        editor.txt.html('<span>123</span>')

        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        editor.txt.html('<span id="123">123</span>')
    })

    test('可以通过revoke方法撤销编辑器设置的文本', done => {
        expect.assertions(3)

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)

            expect(compileData instanceof Array).toBeTruthy()
            expect(compileData.length).toBe(1)

            observer.disconnect()

            revoke(compileData)

            expect(editor.$textElem.html()).toEqual('<span></span>')
            done()
        })

        const $textEl = editor.$textElem.elems[0]

        editor.txt.html('<span></span>')

        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        editor.txt.html('<span>123</span>')
    })

    test('可以通过restore方法恢复撤销的内容', done => {
        expect.assertions(2)

        const testHtml = '<span>123</span>'

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)

            expect(compileData instanceof Array).toBeTruthy()

            observer.disconnect()

            revoke(compileData)

            restore(compileData)

            expect(editor.$textElem.elems[0]).toContainHTML(testHtml)

            done()
        })

        const $textEl = editor.$textElem.elems[0]
        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        editor.txt.html(testHtml)
    })
})
