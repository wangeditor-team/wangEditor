/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'

function withLink<T extends IDomEditor>(editor: T): T {
  const { isInline } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    // @ts-ignore
    const { type } = elem

    if (type === 'link') {
      return true
    }

    return isInline(elem)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withLink
