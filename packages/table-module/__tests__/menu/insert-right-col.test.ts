import InsertRightCol from '../../src/module/menu/InsertRightCol'
import createEditor from '../../../../tests/utils/create-editor'
import { ADD_RIGHT_COL_SVG } from '../../src/constants/svg'
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
describe('Table Module Insert Right Col Menu', () => {
  test('it should create InsertRightCol object', () => {
    const insertRightColMenu = new InsertRightCol()
    expect(typeof insertRightColMenu).toBe('object')
    expect(insertRightColMenu.tag).toBe('button')
    expect(insertRightColMenu.iconSvg).toBe(ADD_RIGHT_COL_SVG)
    expect(insertRightColMenu.title).toBe(locale.tableModule.insertRightCol)
  })

  test('it should get empty string if invoke getValue method', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    expect(insertRightColMenu.getValue(editor)).toBe('')
  })

  test('it should get falsy value if invoke isActive method', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    expect(insertRightColMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    editor.selection = null
    expect(insertRightColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(insertRightColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is not table cell', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(insertRightColMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is table cell', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    expect(insertRightColMenu.isDisabled(editor)).toBeFalsy()
  })

  test('exec should return directly if menu is disabled', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()
    setEditorSelection(editor, null)

    expect(insertRightColMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should return directly if current selected node parent is null', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()

    jest.spyOn(insertRightColMenu, 'isDisabled').mockReturnValue(false)

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
    jest.spyOn(core.DomEditor, 'getParentNode').mockReturnValue(null)

    expect(insertRightColMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should return directly if current selected table row parent is null', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()

    jest.spyOn(insertRightColMenu, 'isDisabled').mockReturnValue(false)

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
    jest
      .spyOn(core.DomEditor, 'getParentNode')
      .mockReturnValue({} as any)
      .mockReturnValue(null)

    expect(insertRightColMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should return directly if current selected table row parent is null', () => {
    const insertRightColMenu = new InsertRightCol()
    const editor = createEditor()

    jest.spyOn(insertRightColMenu, 'isDisabled').mockReturnValue(false)

    const fn = function* a() {
      yield [
        {
          type: 'table-cell',
          children: [],
        } as slate.Element,
        [0, 0],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    jest
      .spyOn(core.DomEditor, 'getParentNode')
      .mockReturnValue({} as any)
      .mockReturnValue({
        type: 'table',
        children: [
          {
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
          },
          {
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
          },
        ],
      } as any)

    jest.spyOn(core.DomEditor, 'findPath').mockReturnValue([0, 0])
    const insertNodesFn = jest.fn()
    jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(insertNodesFn)

    insertRightColMenu.exec(editor, '')

    expect(insertNodesFn).toBeCalledWith(
      editor,
      { type: 'table-cell', children: [{ text: '' }] },
      { at: [0, 1] }
    )
  })
})
