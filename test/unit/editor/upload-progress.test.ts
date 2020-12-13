/**
 * @description Editor upload progress
 * @author luochao
 */

import Progress from '../../../src/editor/upload/progress'
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import $ from 'jquery'

let editor: Editor

const progressClassName = '.w-e-progress'

let id = 1
describe('Editor upload progress', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    test('在编辑器中展示 progress bar', () => {
        const progress = new Progress(editor)

        progress.show(0.5)

        const progressBar = $(`#div${id - 1}`).find(progressClassName)
        expect(progressBar.length).toBe(1)
        expect(progressBar.get(0)).toHaveStyle('width:50%')
        expect(editor.$textContainerElem.elems[0]).toContainHTML(progressBar.get(0).innerHTML)
    })

    test('多次调用不会重复在编辑器中展示 progress bar', () => {
        const progress = new Progress(editor)

        progress.show(0.5)
        progress.show(0.7)

        const progressBar = $(`#div${id - 1}`).find(progressClassName)
        expect(progressBar.length).toBe(1)
    })

    test('在编辑器中展示 progress bar，500ms后自动消失', done => {
        expect.assertions(2)

        const progress = new Progress(editor)

        progress.show(0.5)

        const progressBar = $(`#div${id - 1}`).find(progressClassName)
        expect(progressBar.length).toBe(1)

        setTimeout(() => {
            const progressBar = $(progressClassName)
            expect(progressBar.length).toBe(0)
            done()
        }, 500)
    })

    test('如果设置的进度超过1进度长度样式将失效', () => {
        const progress = new Progress(editor)

        progress.show(1.1)

        const progressBar = $(progressClassName)
        expect(progressBar.length).toBe(1)
        expect(progressBar.get(0)).not.toHaveStyle('width:110%')
    })
})
