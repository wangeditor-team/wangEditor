/**
 * @description 增加缩进
 * @author wangfupeng
 */

import { Transforms, Element, Editor } from 'slate'
import { IDomEditor, t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_RIGHT_SVG } from '../../../constants/icon-svg'
import { IndentElement } from '../custom-types'

class IncreaseIndentMenu extends BaseMenu {
  readonly title = t('indent.increase')
  readonly iconSvg = INDENT_RIGHT_SVG

  isDisabled(editor: IDomEditor): boolean {
    const matchNode = this.getMatchNode(editor)
    if (matchNode == null) return true // 未匹配 p header 等，则禁用

    const { indent } = matchNode as IndentElement
    if (indent) {
      // 有 indent ，则禁用
      return true
    }

    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        indent: `2em`,
      },
      {
        match: n => Element.isElement(n),
        mode: 'highest',
      }
    )
  }
}

export default IncreaseIndentMenu
