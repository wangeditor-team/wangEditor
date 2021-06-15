/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'

function withDivider<T extends IDomEditor>(editor: T): T {
  const { isVoid } = editor
  const newEditor = editor

  // 重写 isVoid
  newEditor.isVoid = elem => {
    // @ts-ignore
    const { type } = elem

    if (type === 'divider') {
      return true
    }

    return isVoid(elem)
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withDivider
