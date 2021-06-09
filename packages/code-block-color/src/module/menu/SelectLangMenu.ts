/**
 * @description code-block select lang
 * @author wangfupeng
 */

import { Node, Transforms } from 'slate'
import { ISelectMenu, IDomEditor, IOption, DomEditor } from '@wangeditor/core'
import { JS_SVG } from '../../constants/svg'
import { getSelectedNodeByType, checkNodeType } from '../_helpers/node'
import { getMenuConf } from '../_helpers/menu'

const DEFAULT_LANG = 'Javascript' // 默认语言

class SelectLangMenu implements ISelectMenu {
  title = '选择语言'
  iconSvg = JS_SVG
  tag = 'select'
  width = 95

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { codeLangs = [] } = getMenuConf(editor, 'codeSelectLang') // 第二个参数 menu key

    codeLangs.forEach((lang: string) => {
      options.push({
        text: lang,
        value: lang,
      })
    })

    // 设置 selected
    const curValue = this.getValue(editor)
    console.log('curValue', curValue)
    options.forEach(opt => {
      if (opt.value === curValue) {
        opt.selected = true
      } else {
        delete opt.selected
      }
    })

    return options
  }

  isActive(editor: IDomEditor): boolean {
    // select menu 会显示 selected value ，用不到 active
    return false
  }

  /**
   * 获取语言类型
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const node = this.getSelectCodeNode(editor)
    if (node == null) return DEFAULT_LANG

    // @ts-ignore
    return node.language || DEFAULT_LANG
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true
    const node = this.getSelectCodeNode(editor)
    if (node) return false
    return true
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const node = this.getSelectCodeNode(editor)
    if (node == null) return

    // 设置语言
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        language: value,
      },
      {
        match: n => checkNodeType(n, 'code'),
      }
    )
  }

  private getSelectCodeNode(editor: IDomEditor): Node | null {
    const codeNode = getSelectedNodeByType(editor, 'code')
    if (codeNode == null) return null
    const preNode = DomEditor.getParentNode(editor, codeNode)
    // @ts-ignore
    if (preNode.type !== 'pre') return null

    return codeNode
  }
}

export default SelectLangMenu
