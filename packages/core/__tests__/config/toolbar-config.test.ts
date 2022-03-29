/**
 * @description toolbar config test
 * @author wangfupeng
 */

import createCoreEditor from '../create-core-editor'
import { IDomEditor } from '../../src/editor/interface'
import createToolbarForSrc from '../../src/create/create-toolbar'

// 注册几个菜单，测试用
import '../menus/register-menus/index'

// 创建 toolbar
function createToolbar(editor: IDomEditor, customConfig = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return createToolbarForSrc(editor, {
    selector: container,
    config: {
      toolbarKeys: ['myButtonMenu', 'mySelectMenu', 'myModalMenu'], // 已注册的菜单 key
      ...customConfig,
    },
  })
}

describe('toolbar config', () => {
  const editor = createCoreEditor()

  it('default config', () => {
    const toolbar = createToolbar(editor)
    const defaultConfig = toolbar.getConfig()
    const { excludeKeys = [], toolbarKeys = [] } = defaultConfig
    expect(excludeKeys.length).toBe(0)
    expect(toolbarKeys.length).toBeGreaterThan(0)
  })

  it('toolbarKeys', () => {
    const keys = ['mySelectMenu', 'myModalMenu']

    const toolbar = createToolbar(editor, {
      toolbarKeys: keys,
    })

    const { toolbarKeys = [] } = toolbar.getConfig()
    expect(toolbarKeys).toEqual(keys)
  })

  it('excludeKeys', () => {
    const keys = ['myButtonMenu', 'mySelectMenu']
    const toolbar = createToolbar(editor, {
      excludeKeys: keys,
    })
    const { excludeKeys = [] } = toolbar.getConfig()
    expect(excludeKeys).toEqual(keys)
  })

  it('insertKeys', () => {
    const toolbarKeys = ['mySelectMenu', 'myModalMenu']
    const insertKeysInfo = {
      index: 0,
      keys: ['myButtonMenu'],
    }
    const toolbar = createToolbar(editor, {
      toolbarKeys,
      insertKeys: insertKeysInfo,
    })
    const { insertKeys = {} } = toolbar.getConfig()
    expect(insertKeys).toEqual(insertKeysInfo)
  })
})
