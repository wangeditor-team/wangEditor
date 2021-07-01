/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor, Node, Transforms } from 'slate'
import { ISelectMenu, IDomEditor, IOption } from '@wangeditor/core'
import { LINE_HEIGHT_SVG } from '../../../constants/icon-svg'
import { getMenuConf } from '../../_helpers/menu'

class LineHeightMenu implements ISelectMenu {
  title = '行高'
  iconSvg = LINE_HEIGHT_SVG
  tag = 'select'
  width = 80

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { lineHeightList = [] } = getMenuConf(editor, 'lineHeight')

    // 生成 options
    options.push({
      text: '默认行高',
      value: '', // this.getValue(editor) 未找到结果时，会返回 '' ，正好对应到这里
    })
    lineHeightList.forEach((height: string) => {
      options.push({
        text: height,
        value: height,
      })
    })

    // 设置 selected
    const curValue = this.getValue(editor)
    options.forEach(opt => {
      if (opt.value === curValue) {
        opt.selected = true
      } else {
        delete opt.selected
      }
    })

    return options
  }

  /**
   * 获取匹配的 node 节点
   * @param editor editor
   */
  private getMatchNode(editor: IDomEditor): Node | null {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // line-height 匹配如下类型的 node
        if (type.startsWith('header')) return true
        if (['paragraph', 'blockquote', 'bulleted-list', 'numbered-list'].includes(type)) {
          return true
        }

        return false
      },
      universal: true,
      mode: 'highest', // 匹配最高层级
    })

    if (nodeEntry == null) return null
    return nodeEntry[0]
  }

  isActive(editor: IDomEditor): boolean {
    // select menu 会显示 selected value ，用不到 active
    return false
  }

  /**
   * 获取 node.lineHeight 的值（如 '1' '1.5'），没有则返回 ''
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const node = this.getMatchNode(editor)
    if (node == null) return ''

    // @ts-ignore
    return node.lineHeight || ''
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true // 禁用

    const node = this.getMatchNode(editor)
    if (node == null) return true // 未匹配到指定 node ，禁用

    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        lineHeight: value,
      },
      { mode: 'highest' }
    )
  }
}

export default LineHeightMenu
