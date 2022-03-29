/**
 * @description config API test
 * @author wangfupeng
 */

import createCoreEditor from '../../create-core-editor' // packages/core 不依赖 packages/editor ，不能使用后者的 createEditor
import { withConfig } from '../../../src/editor/plugins/with-config'

function createEditor(...args) {
  return withConfig(createCoreEditor(...args))
}

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
  })
})
