import { IDomEditor } from '@wangeditor/core'
import * as basicModule from '@wangeditor/basic-modules'
import createEditor from '../../../tests/utils/create-editor'
import withUploadImage from '../src/module/plugin'
import * as uploadImage from '../src/module/upload-images'

let editor: IDomEditor

describe('withUploadImage plugin', () => {
  beforeEach(() => {
    editor = createEditor()

    // mock isInsertImageMenuDisabled
    jest.spyOn(basicModule, 'isInsertImageMenuDisabled').mockImplementation(() => false)
  })

  test('withUploadImage plugin should invoke insertData directly for insert transfer data if isInsertImageMenuDisabled return truthy value', () => {
    jest.spyOn(basicModule, 'isInsertImageMenuDisabled').mockImplementation(() => true)

    const fn = jest.fn()
    editor.insertData = fn

    const newEditor = withUploadImage(editor)
    newEditor.insertData(new DataTransfer())

    expect(fn).toBeCalled()
  })

  test('withUploadImage plugin should invoke insertData with text data if transfer data contains plain text ', () => {
    const fn = jest.fn()
    editor.insertData = fn

    const newEditor = withUploadImage(editor)
    jest.spyOn(DataTransfer.prototype, 'getData').mockImplementation(() => 'plain text')
    const transfer = new DataTransfer()
    newEditor.insertData(transfer)

    expect(transfer.getData('text/plain')).toBe('plain text')
    expect(fn).toBeCalledWith(transfer)

    // 不影响后面的测试，需要重置
    jest.spyOn(DataTransfer.prototype, 'getData').mockImplementation(() => '')
  })

  test('withUploadImage plugin should invoke insertData with transfer data if transfer data contains empty files', () => {
    const fn = jest.fn()
    editor.insertData = fn

    const newEditor = withUploadImage(editor)
    jest.spyOn(DataTransfer.prototype, 'files', 'get').mockReturnValue([] as any)
    newEditor.insertData(new DataTransfer())

    expect(fn).toBeCalled()
  })

  test('withUploadImage plugin should invoke uploadImage method with image files if transfer data contains file which mime type is image', () => {
    const fn = jest.fn()
    jest.spyOn(uploadImage, 'default').mockImplementation(fn)

    const newEditor = withUploadImage(editor)
    jest
      .spyOn(DataTransfer.prototype, 'files', 'get')
      .mockReturnValue([{ type: 'image/png', size: 10 }] as any)

    newEditor.insertData(new DataTransfer())

    expect(fn).toBeCalled()
  })

  test('withUploadImage plugin should invoke insertData method with transfer data if transfer data contains file which mime type is not image', () => {
    const fn = jest.fn()
    editor.insertData = fn

    const newEditor = withUploadImage(editor)
    jest
      .spyOn(DataTransfer.prototype, 'files', 'get')
      .mockReturnValue([{ type: 'text/html', size: 10 }] as any)

    const transfer = new DataTransfer()
    newEditor.insertData(transfer)

    expect(fn).toBeCalledWith(transfer)
  })
})
