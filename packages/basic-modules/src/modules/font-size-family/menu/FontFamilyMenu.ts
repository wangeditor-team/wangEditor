/**
 * @description font-family menu
 * @author wangfupeng
 */

import { IDomEditor, IOption } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { FONT_FAMILY_SVG } from '../../../constants/icon-svg'
import { getMenuConf } from '../../_helpers/menu'

class FontFamilyMenu extends BaseMenu {
  title = '字体'
  iconSvg = FONT_FAMILY_SVG
  mark = 'fontFamily'

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { fontFamilyList = [] } = getMenuConf(editor, this.mark)

    // 生成 options
    options.push({
      text: '默认字体',
      value: '', // this.getValue(editor) 未找到结果时，会返回 '' ，正好对应到这里
    })
    fontFamilyList.forEach((family: string | { name: string; value: string }) => {
      if (typeof family === 'string') {
        options.push({
          text: family,
          value: family,
          styleForRenderMenuList: { 'font-family': family },
        })
      } else if (typeof family === 'object') {
        const { name, value } = family
        options.push({
          text: name,
          value,
          styleForRenderMenuList: { 'font-family': value },
        })
      }
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
}

export default FontFamilyMenu
