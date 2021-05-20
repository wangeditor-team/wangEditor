/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor } from 'slate'

// 可重写 editor API ，参考 @wangeditor/core -> src/editor/with-dom.ts
function withBold<T extends Editor>(editor: T): T {
  const { addMark } = editor
  const newEditor = editor

  // 重写 addMark
  newEditor.addMark = (key: string, value: string) => {
    // 自定义自己的逻辑
    console.log('test plugin')

    addMark(key, value) // 最后，执行默认的函数 ，重要！
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withBold
