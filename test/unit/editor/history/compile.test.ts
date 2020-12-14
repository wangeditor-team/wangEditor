/**
 * @description history compile
 * @author luochao
 */

import createEditor from '../../../helpers/create-editor'
import Editor from '../../../../src/editor'
import compile, {
    compileType,
    compileValue,
    complieNodes,
    compliePosition,
} from '../../../../src/editor/history/data/node/compile'
import { Compile } from '../../../../src/editor/history/data/type'
import { UA } from '../../../../src/utils/util'

let editor: Editor

function generateCompileData(mutationList: MutationRecord[]) {
    let mockData: Compile[] = []
    mutationList.forEach(record => {
        const item: Compile = {
            type: compileType(record.type),
            target: record.target,
            attr: record.attributeName || '',
            value: compileValue(record) || '',
            oldValue: record.oldValue || '',
            nodes: complieNodes(record),
            position: compliePosition(record),
        }
        mockData.push(item)
    })
    return mockData
}

const originalValue = UA.isFirefox

describe('Editor history compile', () => {
    beforeEach(() => {
        editor = createEditor(document, 'div1')
    })

    afterEach(() => {
        Object.defineProperty(UA, 'isFirefox', {
            value: originalValue,
        })
    })

    test('可以将MutationRecord生成Compile数据', done => {
        expect.assertions(3)

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)
            const mockData = generateCompileData(mutationList)
            expect(compileData instanceof Array).toBeTruthy()
            expect(compileData.length).toBe(1)
            expect(compileData).toEqual(mockData)
            done()
        })

        const $textEl = editor.$textElem.elems[0]
        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        editor.txt.html('<span>123</span>')
    })

    test('如果在firefox中，如果有删除节点的mutaion，需要一些特殊处理', done => {
        expect.assertions(2)

        Object.defineProperty(UA, 'isFirefox', {
            value: true,
        })

        const observer = new MutationObserver((mutationList: MutationRecord[]) => {
            const compileData = compile(mutationList)
            expect(compileData instanceof Array).toBeTruthy()
            expect(compileData.length).toBe(4)
            done()
        })

        const $textEl = editor.$textElem.elems[0]
        observer.observe($textEl, { attributes: true, childList: true, subtree: true })

        // 添加多的dom变化情况，可以使得compile statement 执行到达率高
        editor.txt.html('<span id="test">123<i>456</i></span>')
        editor.txt.html('<h1>标题</h1><span id="test">123<i>456</i></span>')
        editor.txt.html('<span>123</span>')
        editor.txt.html('<span></span>')
    })
})
