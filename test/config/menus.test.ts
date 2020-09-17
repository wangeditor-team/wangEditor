/**
 * @description 菜单配置 test
 * @author wangfupeng
 */

import createEditor from '../fns/create-editor'

test('菜单数量', () => {
    const editor = createEditor(document, 'div1')
    const menus = editor.config.menus
    const $toolbarChildren = editor.$toolbarElem.childNodes() || []
    let childrenLen = $toolbarChildren.length
    if (editor.config.showFullScreen) childrenLen = childrenLen - 1
    // config.menus 数量，等于 toolbar 菜单的数量
    expect(menus.length).toBe(childrenLen)
})

// 各个菜单的配置，随后开发的时候再加
