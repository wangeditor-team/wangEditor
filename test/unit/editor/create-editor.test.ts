/**
 * @description 创建编辑器实例
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'

let id = 1
test('创建一个编辑器实例', () => {
    const editor = createEditor(document, `div${id++}`)
    expect(editor.id).not.toBeNull()
})

test('创建一个编辑器实例，toolbar 和 text 分离', () => {
    const editor = createEditor(document, `div${id++}`, `div${id++}`)
    expect(editor.id).not.toBeNull()
})

test('一个页面创建多个编辑器实例', () => {
    const editor1 = createEditor(document, `div${id++}`)
    const editor2 = createEditor(document, `div${id++}`)
    expect(editor1.id).not.toBeNull()
    expect(editor2.id).not.toBeNull()
})
