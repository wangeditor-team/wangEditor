/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'

function withImage<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid, insertData } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    // @ts-ignore
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    // @ts-ignore
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isVoid(elem)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withImage
