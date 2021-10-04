/**
 * @description menu config test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'

describe('menu config', () => {
  it('set and get', () => {
    const menuKey = 'bold' // 必须是一个存在的 menu key
    const menuConfig = {
      x: 100,
    }

    const editor = createEditor({
      config: {
        MENU_CONF: {
          [menuKey]: menuConfig,
        },
      },
    })

    expect(editor.getMenuConfig(menuKey)).toEqual(menuConfig)
  })
})
