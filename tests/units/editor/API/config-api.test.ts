/**
 * @description config API test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'

describe('editor config API', () => {
  it('get config', () => {
    const editor = createEditor()
    const defaultConfig = editor.getConfig()
    expect(defaultConfig).not.toBeNull()
    expect(defaultConfig.autoFocus).toBeTruthy()
    expect(defaultConfig.readOnly).toBeFalsy()
    // 其他 props 不一一写了
  })

  it('get menu config', () => {
    const editor = createEditor()
    const insertLinkConfig = editor.getMenuConfig('insertLink')
    expect(insertLinkConfig).not.toBeNull()
  })

  it('get all menus', () => {
    const editor = createEditor()
    const menuKeys = editor.getAllMenuKeys()
    expect(Array.isArray(menuKeys)).toBeTruthy()
    expect(menuKeys.length).toBeGreaterThan(50) // 内置了 50+ 菜单
  })
})
