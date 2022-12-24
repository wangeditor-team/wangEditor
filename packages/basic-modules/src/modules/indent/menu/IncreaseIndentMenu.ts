/**
 * @description 增加缩进
 * @author wangfupeng
 */

import { Transforms, Element, Editor, Text } from 'slate'
import { IDomEditor, t, DomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { INDENT_RIGHT_SVG } from '../../../constants/icon-svg'
import { IndentElement } from '../custom-types'
import type { FontSizeAndFamilyText } from '../../font-size-family/custom-types'

class IncreaseIndentMenu extends BaseMenu {
  readonly title = t('indent.increase')
  readonly iconSvg = INDENT_RIGHT_SVG
  private DEFAULT_INDENT_VALUE = '2em'

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

  private getIndentValue(editor: IDomEditor) {
    const matchNode = this.getMatchNode(editor)

    if (!matchNode) return this.DEFAULT_INDENT_VALUE
    const textChildren = (matchNode as Element).children.filter(Text.isText)

    const lastTextNode = textChildren[0] as FontSizeAndFamilyText

    if (!lastTextNode || !lastTextNode.fontSize) return this.DEFAULT_INDENT_VALUE

    // 如果段落的第一个 Text 节点 设置了 fontSize 样式，indent 值需要根据 fontSize 进行计算
    const fontSize = lastTextNode.fontSize
    const value = parseInt(lastTextNode.fontSize)
    const unit = fontSize.replace(`${value}`, '')

    return `${value * 2}${unit}`
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    const indent = this.getIndentValue(editor)

    Transforms.setNodes(
      editor,
      {
        indent,
      },
      {
        match: n => Element.isElement(n),
        mode: 'highest',
      }
    )
  }
}

export default IncreaseIndentMenu
