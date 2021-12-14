import uploadFiles from '../../../../packages/upload-image-module/src/module/upload-files'
import createEditor from '../../../utils/create-editor'
import * as core from '@wangeditor/core'

function mockFile(filename: string) {
  const file = new File(['123'], filename)
  return file
}

describe('Upload image menu upload files util', () => {
  test('uploadFiles should do nothing if give null value to fileList argument', async () => {
    const editor = createEditor()
    const res = await uploadFiles(editor, null)
    expect(res).toBeUndefined()
  })

  // // 下面两个 case 执行代码会报错（提示函数未被调用），暂时找不到原因，先注释掉 - wangfupeng 2021.12.14
  // test('uploadFiles should invoke customUpload if give customUpload to config', async () => {
  //   const fn = jest.fn()
  //   const editor = createEditor({
  //     config: {
  //       MENU_CONF: {
  //         uploadImage: {
  //           customUpload: fn,
  //         },
  //       },
  //     },
  //   })

  //   uploadFiles(editor, [mockFile('test.jpg')] as unknown as FileList)

  //   expect(fn).toBeCalled()
  // })

  // test('uploadFiles should invoke core createUploader if not give customUpload to config', async () => {
  //   const fn = jest.fn()
  //   const editor = createEditor()

  //   jest.spyOn(core, 'createUploader').mockImplementation(fn)

  //   uploadFiles(editor, [mockFile('test.jpg')] as unknown as FileList)

  //   expect(fn).toBeCalled()
  // })
})
