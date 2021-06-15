/**
 * @description justify base menu
 * @author wangfupeng
 */

import { Editor, Node } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'

abstract class BaseMenu implements IButtonMenu {
  abstract title: string
  abstract iconSvg: string
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 不需要 active
    return false
  }

  /**
   * 获取 node 节点
   * @param editor editor
   */
  protected getMatchNode(editor: IDomEditor): Node | null {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // 只可用于 p blockquote header
        if (type === 'paragraph') return true
        if (type === 'blockquote') return true
        if (type.startsWith('header')) return true

        return false
      },
      universal: true,
      mode: 'highest', // 匹配最高层级
    })

    if (nodeEntry == null) return null
    return nodeEntry[0]
  }

  isDisabled(editor: IDomEditor): boolean {
    // 一直不禁用
    return false
  }

  abstract exec(editor: IDomEditor, value: string | boolean): void
}

export default BaseMenu
