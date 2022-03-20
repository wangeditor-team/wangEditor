import DeleteCol from '../../src/module/menu/DeleteCol'
import createEditor from '../../../../tests/utils/create-editor'
import { DEL_COL_SVG } from '../../src/constants/svg'
import locale from '../../src/locale/zh-CN'
import * as slate from 'slate'
import * as core from '@wangeditor/core'

function setEditorSelection(
  editor: core.IDomEditor,
  selection: slate.Selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }
) {
  editor.selection = selection
}
describe('Table Module Delete Col Menu', () => {
  test('it should create DeleteCol object', () => {
    const deleteColMenu = new DeleteCol()
    expect(typeof deleteColMenu).toBe('object')
    expect(deleteColMenu.tag).toBe('button')
    expect(deleteColMenu.iconSvg).toBe(DEL_COL_SVG)
    expect(deleteColMenu.title).toBe(locale.tableModule.deleteCol)
  })

  test('it should get empty string if invoke getValue method', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    expect(deleteColMenu.getValue(editor)).toBe('')
  })

  test('it should get falsy value if invoke isActive method', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    expect(deleteColMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    editor.selection = null
    expect(deleteColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(deleteColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is not table cell', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(deleteColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is table cell', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    expect(deleteColMenu.isDisabled(editor)).toBeFalsy()
  })

  test('exec should return directly if menu is disabled', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()
    setEditorSelection(editor, null)

    expect(deleteColMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should invoke removeNodes method to remove whole table if menu is not disabled and table col length less than 1', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()

    jest.spyOn(deleteColMenu, 'isDisabled').mockImplementation(() => false)
    jest.spyOn(core.DomEditor, 'getParentNode').mockImplementation(() => ({
      type: 'table-col',
      children: [],
    }))

    const fn = function* a() {
      yield [
        {
          type: 'table-cell',
          children: [],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    const removeNodesFn = jest.fn()
    jest.spyOn(slate.Transforms, 'removeNodes').mockImplementation(removeNodesFn)

    deleteColMenu.exec(editor, '')
    expect(removeNodesFn).toBeCalled()
  })

  test('exec should invoke removeNodes method to remove all table cells if menu is not disabled and table col length greater than 1', () => {
    const deleteColMenu = new DeleteCol()
    const editor = createEditor()

    jest.spyOn(deleteColMenu, 'isDisabled').mockImplementation(() => false)
    jest.spyOn(core.DomEditor, 'getParentNode').mockImplementation(() => ({
      type: 'table-row',
      children: [
        {
          type: 'table-col',
          children: [{ type: 'table-cell', children: [] }],
        },
        {
          type: 'table-col',
          children: [{ type: 'table-cell', children: [] }],
        },
      ],
    }))

    const fn = function* a() {
      yield [
        {
          type: 'table-cell',
          children: [],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    jest.spyOn(core.DomEditor, 'findPath').mockImplementation(() => [0, 1] as slate.Path)
    const removeNodesFn = jest.fn()
    jest.spyOn(slate.Transforms, 'removeNodes').mockImplementation(removeNodesFn)

    deleteColMenu.exec(editor, '')
    expect(removeNodesFn).toBeCalledTimes(2)
  })
})
