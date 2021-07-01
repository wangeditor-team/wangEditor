/**
 * @description 减少缩进
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_LEFT_SVG } from '../../../constants/icon-svg'

class DecreaseIndentMenu extends BaseMenu {
  title = '减少缩进'
  iconSvg = INDENT_LEFT_SVG

  isDisabled(editor: IDomEditor): boolean {
    const matchNode = this.getMatchNode(editor)
    if (matchNode == null) return true // 未匹配 p header 等，则禁用

    // @ts-ignore
    const { indent } = matchNode
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

    Transforms.setNodes(editor, {
      // @ts-ignore
      indent: newNum === 0 ? null : `${newNum}px`,
    })
  }
}

export default DecreaseIndentMenu
