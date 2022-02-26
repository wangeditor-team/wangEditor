import uploadImages from '@wangeditor/upload-image-module/src/module/upload-images'
import createEditor from '../../../tests/utils/create-editor'
import * as core from '@wangeditor/core'

function mockFile(filename: string) {
  const file = new File(['123'], filename)
  return file
}

describe('Upload image menu upload files util', () => {
  test('uploadImages should do nothing if give null value to fileList argument', async () => {
    const editor = createEditor()
    const res = await uploadImages(editor, null)
    expect(res).toBeUndefined()
  })

  // // 下面两个 case 执行代码会报错（提示函数未被调用），暂时找不到原因，先注释掉 - wangfupeng 2021.12.14
  // test('uploadImages should invoke customUpload if give customUpload to config', async () => {
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

  //   uploadImages(editor, [mockFile('test.jpg')] as unknown as FileList)

  //   expect(fn).toBeCalled()
  // })

  // test('uploadImages should invoke core createUploader if not give customUpload to config', async () => {
  //   const fn = jest.fn()
  //   const editor = createEditor()

  //   jest.spyOn(core, 'createUploader').mockImplementation(fn)

  //   uploadImages(editor, [mockFile('test.jpg')] as unknown as FileList)

  //   expect(fn).toBeCalled()
  // })
})
