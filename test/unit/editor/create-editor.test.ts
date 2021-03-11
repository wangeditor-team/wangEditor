/**
 * @description 创建编辑器实例
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'

test('创建一个编辑器实例', () => {
    const editor = createEditor(document, 'div1')
    expect(editor.id).not.toBeNull()
})

test('创建一个编辑器实例，toolbar 和 text 分离', () => {
    const editor = createEditor(document, 'div2', 'div3')
    expect(editor.id).not.toBeNull()
})

test('一个页面创建多个编辑器实例', () => {
    const editor1 = createEditor(document, 'div4')
    const editor2 = createEditor(document, 'div5')
    expect(editor1.id).not.toBeNull()
    expect(editor2.id).not.toBeNull()
})

test('创建一个编辑器实例，toolbar 和 text 分离，且文本区域带标签的内容代入编辑区域', () => {
    const editor = createEditor(document, 'div6', 'div7', {}, `<p>测试下</p>`)
    expect(editor.id).not.toBeNull()
    expect(editor.txt.text()).toBe('测试下')
})
