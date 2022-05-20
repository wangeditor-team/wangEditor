import FullWidth from '../../src/module/menu/FullWidth'
import createEditor from '../../../../tests/utils/create-editor'
import { FULL_WIDTH_SVG } from '../../src/constants/svg'
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
describe('Table Module Full Width Menu', () => {
  test('it should create FullWidth object', () => {
    const fullWidthMenu = new FullWidth()
    expect(typeof fullWidthMenu).toBe('object')
    expect(fullWidthMenu.tag).toBe('button')
    expect(fullWidthMenu.iconSvg).toBe(FULL_WIDTH_SVG)
    expect(fullWidthMenu.title).toBe(locale.tableModule.widthAuto)
  })

  test('getValue should get falsy value if editor selected node is not table', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()

    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)
    expect(fullWidthMenu.getValue(editor)).toBeFalsy()
  })

  test(`getValue should get truthy value if editor selected table's width is 100%`, () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()

    jest
      .spyOn(core.DomEditor, 'getSelectedNodeByType')
      .mockImplementation(() => ({ width: '100%' } as any))
    expect(fullWidthMenu.getValue(editor)).toBeTruthy()
  })

  test('isActive should get falsy value if editor selected node is not table', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(fullWidthMenu.isActive(editor)).toBeFalsy()
  })

  test('isDisabled should get truthy value if editor selection is null', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    editor.selection = null
    expect(fullWidthMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor selection is collapsed', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => false)

    expect(fullWidthMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get truthy value if editor current selected node is not table cell', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => null)

    expect(fullWidthMenu.isDisabled(editor)).toBeTruthy()
  })

  test('isDisabled should get falsy value if editor current selected node is table cell', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    expect(fullWidthMenu.isDisabled(editor)).toBeFalsy()
  })

  test('exec should return directly if menu is disabled', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    setEditorSelection(editor, null)

    expect(fullWidthMenu.exec(editor, '')).toBeUndefined()
  })

  test('exec should invoke setNodes with props if menu is not disabled', () => {
    const fullWidthMenu = new FullWidth()
    const editor = createEditor()
    setEditorSelection(editor)

    jest.spyOn(slate.Range, 'isCollapsed').mockImplementation(() => true)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockImplementation(() => ({} as any))

    const fn = jest.fn()
    jest.spyOn(slate.Transforms, 'setNodes').mockImplementation(fn)

    fullWidthMenu.exec(editor, true)

    expect(fn).toBeCalled()
  })
})
