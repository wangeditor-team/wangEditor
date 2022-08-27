import InsertTopRow from '../../src/module/menu/InsertTopRow'
import createEditor from '../../../../tests/utils/create-editor'
import { ADD_TOP_ROW_SVG } from '../../src/constants/svg'
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
describe('Table Module Insert Top Row Menu', () => {
  test('it should create InsertTopRow object', () => {
    const insertTopRowMenu = new InsertTopRow()
    expect(typeof insertTopRowMenu).toBe('object')
    expect(insertTopRowMenu.tag).toBe('button')
    expect(insertTopRowMenu.iconSvg).toBe(ADD_TOP_ROW_SVG)
    expect(insertTopRowMenu.title).toBe(locale.tableModule.insertTopRow)
  })

  test('it should get empty string if invoke getValue method', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    expect(insertTopRowMenu.getValue(editor)).toBe('')
  })

  test('it should get falsy value if invoke isActive method', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    expect(insertTopRowMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    editor.selection = null
    expect(insertTopRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(insertTopRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is not table cell', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(insertTopRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is table cell', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    expect(insertTopRowMenu.isDisabled(editor)).toBeFalsy()
  })

  test('exec should return directly if menu is disabled', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()
    setEditorSelection(editor, null)

    expect(insertTopRowMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should invoke insertNodes method to remove whole table if menu is not disabled', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()

    jest.spyOn(insertTopRowMenu, 'isDisabled').mockReturnValue(false)
    jest.spyOn(core.DomEditor, 'getParentNode').mockImplementation(() => ({
      type: 'table-row',
      children: [
        {
          type: 'table-cell',
          children: [],
        },
        {
          type: 'table-cell',
          children: [],
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
    const insertNodesFn = jest.fn()
    jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(insertNodesFn)

    insertTopRowMenu.exec(editor, '')
    expect(insertNodesFn).toBeCalled()
  })

  test('exec should return directly if current selected row that does not has children', () => {
    const insertTopRowMenu = new InsertTopRow()
    const editor = createEditor()

    jest.spyOn(insertTopRowMenu, 'isDisabled').mockReturnValue(false)
    jest.spyOn(core.DomEditor, 'getParentNode').mockImplementation(() => ({
      type: 'table-row',
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
    const insertNodesFn = jest.fn()
    jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(insertNodesFn)

    expect(insertTopRowMenu.exec(editor, '')).toBeUndefined()
    expect(insertNodesFn).not.toBeCalled()
  })
})
