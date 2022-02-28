import { IDomEditor } from '../../../packages/editor/src'
import UploadImageMenu from '../src/module/menu/UploadImageMenu'
import createEditor from '../../../tests/utils/create-editor'

let editor: IDomEditor
let menu: UploadImageMenu

describe('Upload image menu', () => {
  beforeEach(() => {
    editor = createEditor()
    menu = new UploadImageMenu()
  })

  test('UploadImageMenu instance title is "上传图片" for zhCn locale config', () => {
    expect(menu.title).toBe('上传图片')
  })

  test('UploadImageMenu invoke getValue return ""', () => {
    expect(menu.getValue(editor)).toBe('')
  })

  test('UploadImageMenu invoke isActive always return false', () => {
    expect(menu.isActive(editor)).toBe(false)
  })

  test('UploadImageMenu invoke exec should exec customBrowseAndUpload if config has customBrowseAndUpload option', () => {
    const jestFn = jest.fn()
    const editor = createEditor({
      config: {
        MENU_CONF: {
          uploadImage: {
            customBrowseAndUpload: jestFn,
          },
        },
      },
    })
    menu.exec(editor, 'test.jpg')
    expect(jestFn).toBeCalled()
  })

  test('UploadImageMenu invoke exec should insert hidden input element to body', () => {
    const editor = createEditor({
      config: {
        MENU_CONF: {
          uploadImage: {
            allowedFileTypes: ['jpg', 'png'],
          },
        },
      },
    })

    // 防卫断言
    expect(document.querySelector('input')).toBeNull()

    menu.exec(editor, 'test.jpg')

    expect(document.querySelector('input') instanceof HTMLInputElement).toBeTruthy()
  })
})
