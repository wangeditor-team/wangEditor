import InsertTable from '../../src/module/menu/InsertTable'
import createEditor from '../../../../tests/utils/create-editor'
import { TABLE_SVG } from '../../src/constants/svg'
import locale from '../../src/locale/zh-CN'
import * as slate from 'slate'
import * as core from '@wangeditor/core'
import $, { DOMElement } from '../../src/utils/dom'

function setEditorSelection(
  editor: core.IDomEditor,
  selection: slate.Selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }
) {
  editor.selection = selection
}
describe('Table Module Insert Table Menu', () => {
  test('it should create InsertTable object', () => {
    const insertTableMenu = new InsertTable()
    expect(typeof insertTableMenu).toBe('object')
    expect(insertTableMenu.tag).toBe('button')
    expect(insertTableMenu.iconSvg).toBe(TABLE_SVG)
    expect(insertTableMenu.title).toBe(locale.tableModule.insertTable)
  })

  test('it should get empty string if invoke getValue method', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    expect(insertTableMenu.getValue(editor)).toBe('')
  })

  test('it should get falsy value if invoke isActive method', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    expect(insertTableMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    editor.selection = null
    expect(insertTableMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(insertTableMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is contains pre node', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest
      .spyOn(core.DomEditor, 'getSelectedElems')
      .mockImplementation(() => [{ type: 'pre', children: [] }])

    expect(insertTableMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is contains table node', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest
      .spyOn(core.DomEditor, 'getSelectedElems')
      .mockImplementation(() => [{ type: 'table', children: [] }])

    expect(insertTableMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is contains void node', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest
      .spyOn(core.DomEditor, 'getSelectedElems')
      .mockImplementation(() => [{ type: 'image', children: [] }])

    jest.spyOn(editor, 'isVoid').mockImplementation(() => true)

    expect(insertTableMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is valid', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest
      .spyOn(core.DomEditor, 'getSelectedElems')
      .mockImplementation(() => [{ type: 'paragraph', children: [] }])

    expect(insertTableMenu.isDisabled(editor)).toBeFalsy()
  })

  test('getPanelContentElem should return table panel dom', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()

    expect(insertTableMenu.getPanelContentElem(editor) instanceof DOMElement).toBeTruthy()
    expect(insertTableMenu.getPanelContentElem(editor).className).toBe('w-e-panel-content-table')
  })

  test('it should invoke insertNodes method if click panel td node', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()

    const tablePanel = insertTableMenu.getPanelContentElem(editor)
    const tdEl = $(tablePanel).find('td')[0]

    const fn = jest.fn()
    jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(fn)

    tdEl.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    )

    expect(fn).toBeCalled()
  })

  test('it should add active class if mouse enter panel td node', () => {
    const insertTableMenu = new InsertTable()
    const editor = createEditor()

    const tablePanel = insertTableMenu.getPanelContentElem(editor)
    const tdEl = $(tablePanel).find('td')[0]

    expect(tdEl.className).toBe('')

    tdEl.dispatchEvent(
      new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    )

    expect(tdEl.className).toBe('active')
  })
})
