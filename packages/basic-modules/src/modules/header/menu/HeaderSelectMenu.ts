/**
 * @description header menu
 * @author wangfupeng
 */

import { ISelectMenu, IDomEditor, IOption, t } from '@wangeditor/core'
import { HEADER_SVG } from '../../../constants/icon-svg'
import { getHeaderType, isMenuDisabled, setHeaderType } from '../helper'

class HeaderSelectMenu implements ISelectMenu {
  readonly title = t('header.title')
  readonly iconSvg = HEADER_SVG
  readonly tag = 'select'
  readonly width = 60

  getOptions(editor: IDomEditor): IOption[] {
    // 基本的 options 列表
    const options = [
      // value 和 elemNode.type 对应
      {
        value: 'header1',
        text: 'H1',
        styleForRenderMenuList: { 'font-size': '32px', 'font-weight': 'bold' },
      },
      {
        value: 'header2',
        text: 'H2',
        styleForRenderMenuList: { 'font-size': '24px', 'font-weight': 'bold' },
      },
      {
        value: 'header3',
        text: 'H3',
        styleForRenderMenuList: { 'font-size': '18px', 'font-weight': 'bold' },
      },
      {
        value: 'header4',
        text: 'H4',
        styleForRenderMenuList: { 'font-size': '16px', 'font-weight': 'bold' },
      },
      {
        value: 'header5',
        text: 'H5',
        styleForRenderMenuList: { 'font-size': '13px', 'font-weight': 'bold' },
      },
      { value: 'paragraph', text: t('header.text') },
    ]

    // 获取 value ，设置 selected
    const curValue = this.getValue(editor).toString()
    options.forEach((opt: IOption) => {
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
   * 获取选中节点的 node.type
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    return getHeaderType(editor)
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor)
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  exec(editor: IDomEditor, value: string | boolean) {
    //【注意】value 是 select change 时获取的，并不是 this.getValue 的值
    setHeaderType(editor, value.toString())
  }
}

export default HeaderSelectMenu
