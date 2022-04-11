/**
 * @description blockquote menu class
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { QUOTE_SVG } from '../../../constants/icon-svg'

class BlockquoteMenu implements IButtonMenu {
  readonly title = t('blockQuote.title')
  readonly iconSvg = QUOTE_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 用不到 getValue
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const node = DomEditor.getSelectedNodeByType(editor, 'blockquote')
    return !!node
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        const type = DomEditor.getNodeType(n)

        // 只可用于 p 和 blockquote
        if (type === 'paragraph') return true
        if (type === 'blockquote') return true

        return false
      },
      universal: true,
      mode: 'highest', // 匹配最高层级
    })

    // 匹配到 p blockquote ，不禁用
    if (nodeEntry) {
      return false
    }
    // 未匹配到，则禁用
    return true
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    const active = this.isActive(editor)
    const newType = active ? 'paragraph' : 'blockquote'

    // 执行命令
    Transforms.setNodes(editor, { type: newType }, { mode: 'highest' })
  }
}

export default BlockquoteMenu
