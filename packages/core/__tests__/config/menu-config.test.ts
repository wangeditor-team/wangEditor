/**
 * @description menu config test
 * @author wangfupeng
 */

import createCoreEditor from '../create-core-editor' // packages/core 不依赖 packages/editor ，不能使用后者的 createEditor
import { registerGlobalMenuConf } from '../../src/config/register'

describe('menu config', () => {
  it('set and get', () => {
    // 先注册一下菜单 key ，再设置配置（专为单元测试，用户使用时不涉及）
    registerGlobalMenuConf('bold', {})

    const menuKey = 'bold' // 必须是一个存在的 menu key
    const menuConfig = {
      x: 100,
    }

    const editor = createCoreEditor({
      config: {
        MENU_CONF: {
          [menuKey]: menuConfig,
        },
      },
    })

    expect(editor.getMenuConfig(menuKey)).toEqual(menuConfig)
  })
})
