import InsertRow from '../../src/module/menu/InsertRow'
import createEditor from '../../../../tests/utils/create-editor'
import { ADD_ROW_SVG } from '../../src/constants/svg'
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
describe('Table Module Insert Row Menu', () => {
  test('it should create InsertRow object', () => {
    const insertRowMenu = new InsertRow()
    expect(typeof insertRowMenu).toBe('object')
    expect(insertRowMenu.tag).toBe('button')
    expect(insertRowMenu.iconSvg).toBe(ADD_ROW_SVG)
    expect(insertRowMenu.title).toBe(locale.tableModule.insertRow)
  })

  test('it should get empty string if invoke getValue method', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    expect(insertRowMenu.getValue(editor)).toBe('')
  })

  test('it should get falsy value if invoke isActive method', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    expect(insertRowMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    editor.selection = null
    expect(insertRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(insertRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is not table cell', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(insertRowMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is table cell', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    expect(insertRowMenu.isDisabled(editor)).toBeFalsy()
  })

  test('exec should return directly if menu is disabled', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()
    setEditorSelection(editor, null)

    expect(insertRowMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should invoke insertNodes method to remove whole table if menu is not disabled', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()

    jest.spyOn(insertRowMenu, 'isDisabled').mockReturnValue(false)
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

    insertRowMenu.exec(editor, '')
    expect(insertNodesFn).toBeCalled()
  })

  test('exec should return directly if current selected row that does not has children', () => {
    const insertRowMenu = new InsertRow()
    const editor = createEditor()

    jest.spyOn(insertRowMenu, 'isDisabled').mockReturnValue(false)
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

    expect(insertRowMenu.exec(editor, '')).toBeUndefined()
    expect(insertNodesFn).not.toBeCalled()
  })
})
