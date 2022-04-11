/**
 * @description justify base menu
 * @author wangfupeng
 */

import { Editor, Node, Element } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'

abstract class BaseMenu implements IButtonMenu {
  abstract readonly title: string
  abstract readonly iconSvg: string
  readonly tag = 'button'

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
        const type = DomEditor.getNodeType(n)

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
    if (editor.selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const notMatch = selectedElems.some((elem: Node) => {
      if (Editor.isVoid(editor, elem) && Editor.isBlock(editor, elem)) return true

      const { type } = elem as unknown as Element
      if (['pre', 'code'].includes(type)) return true
    })
    if (notMatch) return true

    return false
  }

  abstract exec(editor: IDomEditor, value: string | boolean): void
}

export default BaseMenu
