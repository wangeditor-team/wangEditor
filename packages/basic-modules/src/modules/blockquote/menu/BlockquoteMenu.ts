/**
 * @description blockquote menu class
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { QUOTE_SVG } from '../../../constants/icon-svg'
import { getSelectedNodeByType } from '../../_helpers/node'

class BlockquoteMenu implements IButtonMenu {
  title = '引用'
  iconSvg = QUOTE_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 用不到 getValue
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const node = getSelectedNodeByType(editor, 'blockquote')
    return !!node
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const [nodeEntry] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

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
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        type: newType,
      },
      { mode: 'highest' }
    )
  }
}

export default BlockquoteMenu
