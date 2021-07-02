/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Path, Operation } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function withImage<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid /*, apply */ } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isVoid(elem)
  }

  // // 监听删除图片
  // // 【注意】暂时不开放这个功能，因为图片删除还可能被撤销回来，所以无法通过 remove_node 这一个动作来处理删除图片
  // // 要实现“获取用户删除的图片”还需要更多的支持，例如收集 remove_node 的图片，最后和所有图片进行对比
  // // 还要考虑编辑图片
  // newEditor.apply = (op: Operation) => {
  //   if (op.type === 'remove_node') {
  //     const { node } = op
  //     if (node.type === 'image') {
  //       console.log('removed image node', node)
  //     }
  //   }

  //   // 执行原本的 apply - 重要！！！
  //   apply(op)
  // }

  // 返回 editor ，重要！
  return newEditor
}

export default withImage
