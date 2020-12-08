/**
 * @description 样式配置 test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'

test('z-index 测试', () => {
    const editor = createEditor(document, 'div1')
    const textElem: any = editor.$textContainerElem.elems[0]
    const zIndexFromDom = textElem.style['z-index']
    expect(editor.config.zIndex).toBe(parseInt(zIndexFromDom))
})
