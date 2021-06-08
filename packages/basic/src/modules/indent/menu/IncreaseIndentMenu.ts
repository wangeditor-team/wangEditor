/**
 * @description 增加缩进
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_RIGHT_SVG } from '../../_helpers/icon-svg'

class IncreaseIndentMenu extends BaseMenu {
  title = '增加缩进'
  iconSvg = INDENT_RIGHT_SVG

  isDisabled(editor: IDomEditor): boolean {
    const matchNode = this.getMatchNode(editor)
    if (matchNode == null) return true // 未匹配 p header 等，则禁用

    // @ts-ignore
    const { indent } = matchNode
    if (indent) {
      // 当前已经有 indent ，则禁用
      return true
    }

    return false // 其他情况，不禁用
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(editor, {
      // @ts-ignore
      indent: true,
    })
  }
}

export default IncreaseIndentMenu
