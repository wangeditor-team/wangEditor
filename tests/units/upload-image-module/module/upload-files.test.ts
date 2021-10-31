import uploadFiles from '../../../../packages/upload-image-module/src/module/upload-files'
import createEditor from '../../../utils/create-editor'
import * as core from '@wangeditor/core'

function mockFile(filename: string) {
  const file = new File(['123'], filename)
  return file
}

describe('Upload image menu upload files util', () => {
  test('uploadFiles should do nothing if give null value to fileList argument', () => {
    const editor = createEditor()
    expect(uploadFiles(editor, null)).toBeUndefined()
  })

  test('uploadFiles should invoke customUpload if give customUpload to config', () => {
    const fn = jest.fn()
    const editor = createEditor({
      config: {
        MENU_CONF: {
          uploadImage: {
            customUpload: fn,
          },
        },
      },
    })

    uploadFiles(editor, [mockFile('test.jpg')] as unknown as FileList)

    expect(fn).toBeCalled()
  })

  test('uploadFiles should invoke core createUploader if not give customUpload to config', () => {
    const fn = jest.fn()
    const editor = createEditor()

    jest.spyOn(core, 'createUploader').mockImplementation(fn)

    uploadFiles(editor, [mockFile('test.jpg')] as unknown as FileList)

    expect(fn).toBeCalled()
  })
})
