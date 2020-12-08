/**
 * @description cmd 相关配置，test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'

test('styleWithCSS 测试', () => {
    const editor = createEditor(document, 'div1')
    expect(editor.config.styleWithCSS).toBe(false)
})
