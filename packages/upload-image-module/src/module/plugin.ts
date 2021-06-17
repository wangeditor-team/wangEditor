/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'

function withUploadImage<T extends IDomEditor>(editor: T): T {
  const { insertData } = editor
  const newEditor = editor

  // 重写 insertData
  newEditor.insertData = (data: DataTransfer) => {
    // TODO data.files 拖拽上传图片，可参考 https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx

    insertData(data)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withUploadImage
