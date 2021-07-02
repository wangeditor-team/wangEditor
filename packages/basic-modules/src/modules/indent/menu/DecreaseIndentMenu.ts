/**
 * @description 减少缩进
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_LEFT_SVG } from '../../../constants/icon-svg'
import { IndentElement } from '../custom-types'

class DecreaseIndentMenu extends BaseMenu {
  title = '减少缩进'
  iconSvg = INDENT_LEFT_SVG

  isDisabled(editor: IDomEditor): boolean {
    const matchNode = this.getMatchNode(editor)
    if (matchNode == null) return true // 未匹配 p header 等，则禁用

    const { indent } = matchNode as IndentElement
    if (!indent) {
      // 没有 indent ，则禁用
      return true
    }

    return false // 其他情况，不禁用
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    if (!value) return

    const indentNum = parseInt(value.toString(), 10)
    let newNum = indentNum - 32 // 减少缩进，减少 32px
    if (newNum < 0) newNum = 0

    Transforms.setNodes(
      editor,
      {
        indent: newNum === 0 ? null : `${newNum}px`,
      },
      { match: n => Element.isElement(n) }
    )
  }
}

export default DecreaseIndentMenu
