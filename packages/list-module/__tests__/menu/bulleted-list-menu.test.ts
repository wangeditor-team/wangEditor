/**
 * @description bulletedList menu test
 * @author wangfupeng
 */

import BulletedListMenu from '../../src/module/menu/BulletedListMenu'
import createEditor from '../../../../tests/utils/create-editor'

describe('list BulletedListMenu', () => {
  const menu = new BulletedListMenu()

  it('getValue', () => {
    const editor = createEditor()
    expect(menu.getValue(editor)).toBe('')
  })

  it('isActive', () => {
    const editor = createEditor({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'list-item', children: [{ text: 'a' }] },
      ],
    })

    editor.deselect()
    expect(menu.isActive(editor)).toBeFalsy()

    editor.select({ path: [0, 0], offset: 0 }) // 选中 p
    expect(menu.isActive(editor)).toBeFalsy()

    editor.select({ path: [1, 0], offset: 0 }) // 选中 li
    expect(menu.isActive(editor)).toBeTruthy()
  })

  it('isDisabled', () => {
    const editor = createEditor({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'list-item', children: [{ text: 'a' }] },
        {
          type: 'table',
          width: 'auto',
          children: [
            {
              type: 'table-row',
              children: [{ type: 'table-cell', children: [{ text: '' }], isHeader: true }],
            },
          ],
        },
        {
          type: 'pre',
          children: [{ type: 'code', language: '', children: [{ text: 'a' }] }],
        },
      ],
    })

    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select({ path: [0, 0], offset: 0 }) // 选中 p
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.select({ path: [1, 0], offset: 0 }) // 选中 li
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.select({ path: [2, 0, 0, 0], offset: 0 }) // 选中 table 单元格
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select({ path: [3, 0, 0], offset: 0 }) // 选中 code
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('exec', () => {
    const pElem = { type: 'paragraph', children: [{ text: 'hello' }] }
    const editor = createEditor({
      content: [pElem],
    })
    editor.select({ path: [0, 0], offset: 0 }) // 选中 p

    menu.exec(editor, '') // p 转 li
    expect(editor.children).toEqual([
      {
        type: 'list-item',
        ordered: false,
        children: [{ text: 'hello' }],
      },
    ])

    menu.exec(editor, '') // li 转 p
    expect(editor.children).toEqual([pElem])
  })
})
