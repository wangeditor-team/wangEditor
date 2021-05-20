/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor } from 'slate'

// 可重写 editor API ，参考 @wangeditor/core -> src/editor/with-dom.ts
function withHeader<T extends Editor>(editor: T): T {
  const { insertBreak } = editor
  const newEditor = editor

  // 重写 insertBreak ，header 末尾回车时要插入 paragraph
  newEditor.insertBreak = () => {
    // TODO header 末尾回车时要插入 paragraph

    insertBreak() // 最后，执行默认的函数 ，重要！
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withHeader
