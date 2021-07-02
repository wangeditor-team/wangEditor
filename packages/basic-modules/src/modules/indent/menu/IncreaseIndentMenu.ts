/**
 * @description 增加缩进
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_RIGHT_SVG } from '../../../constants/icon-svg'

class IncreaseIndentMenu extends BaseMenu {
  title = '增加缩进'
  iconSvg = INDENT_RIGHT_SVG

  isDisabled(editor: IDomEditor): boolean {
    const matchNode = this.getMatchNode(editor)
    if (matchNode == null) return true // 未匹配 p header 等，则禁用

    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    let indentNum = parseInt(value.toString(), 10)
    if (!indentNum) indentNum = 0

    let newNum = indentNum + 32 // 增加缩进，增加 32px

    Transforms.setNodes(
      editor,
      {
        indent: `${newNum}px`,
      },
      { match: n => Element.isElement(n) }
    )
  }
}

export default IncreaseIndentMenu
