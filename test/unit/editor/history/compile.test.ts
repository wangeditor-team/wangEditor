import createEditor from '../../../helpers/create-editor'
import Editor from '../../../../src/editor'
import compile, {
    compileType,
    compileValue,
    complieNodes,
    compliePosition,
} from '../../../../src/editor/history/data/node/compile'
import { Compile } from '../../../../src/editor/history/data/type'

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

describe('Editor history compile', () => {
    beforeEach(() => {
        editor = createEditor(document, 'div1')
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
})
