/**
 * @description toolbar config test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import createToolbar from '../../../../tests/utils/create-toolbar'

describe('toolbar config', () => {
  const editor = createEditor()

  it('default config', () => {
    const toolbar = createToolbar(editor)
    const defaultConfig = toolbar.getConfig()
    const { excludeKeys = [], toolbarKeys = [] } = defaultConfig
    expect(excludeKeys.length).toBe(0)
    expect(toolbarKeys.length).toBeGreaterThan(0)
  })

  it('toolbarKeys', () => {
    const keys = [
      'headerSelect',
      '|',
      'bold',
      'color',
      'insertImage',
      '|',
      {
        key: 'group-more-style', // 必填，要以 group 开头
        title: '更多样式', // 必填
        iconSvg: '<svg>....</svg>', // 可选
        menuKeys: ['through', 'code', 'clearStyle'], // 下级菜单 key ，必填
      },
    ]

    const toolbar = createToolbar(editor, {
      toolbarKeys: keys,
    })

    const { toolbarKeys = [] } = toolbar.getConfig()
    expect(toolbarKeys).toEqual(keys)
  })

  it('excludeKeys', () => {
    const keys = ['headerSelect', 'italic']
    const toolbar = createToolbar(editor, {
      excludeKeys: keys,
    })
    const { excludeKeys = [] } = toolbar.getConfig()
    expect(excludeKeys).toEqual(keys)
  })

  // // 这里先注释掉 - wangfupeng 2022.01.06
  // // 因为 insertKeys 不应该修改 toolbarKeys 的值，还因此引发了一个 bug wangEditor-v5/issues/330
  // it('if set insertKeys, it will insert key to specify position', done => {
  //   const keys = ['headerSelect', 'italic']
  //   const toolbar = createToolbar(editor, {
  //     insertKeys: {
  //       index: 8,
  //       keys,
  //     },
  //   })
  //   setTimeout(() => {
  //     const { toolbarKeys = [] } = toolbar.getConfig()
  //     expect(toolbarKeys.slice(8, 8 + keys.length)).toEqual(keys)
  //     done()
  //   })
  // })
})
