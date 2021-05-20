/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'

class HeaderMenu implements IMenuItem {
  title = '标题'
  iconClass = 'w-e-icon-header'
  tag = 'select'
  options = [
    // value 和 elemNode.type 对应
    { value: 'header1', text: 'H1' },
    { value: 'header2', text: 'H2' },
    { value: 'header3', text: 'H3' },
    { value: 'paragraph', text: '正文', selected: true },
  ]

  /**
   * 获取 node.type
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const [match] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        const { type = '' } = n
        return type.startsWith('header') // 匹配 node.type 是 header 开头的 node
      },
      universal: true,
    })

    // 未匹配到 header
    if (match == null) return 'paragraph'

    // 匹配到 header
    const [n] = match
    // @ts-ignore
    return n.type
  }
  isDisabled(editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type } = n

        // 检测是否在代码块
        if (type === 'pre') return true

        // 检测是否在 table
        if (type === 'table') return true

        // TODO 检测是否 void

        return false
      },
      universal: true,
    })

    if (match) return true
    return false
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  cmd(editor: IDomEditor, value?: string | boolean) {
    console.log('value', value)
    if (!value) return

    Transforms.setNodes(editor, {
      // @ts-ignore
      type: value,
    })
  }
}

export default {
  key: 'header',
  factory() {
    return new HeaderMenu()
  },
}
