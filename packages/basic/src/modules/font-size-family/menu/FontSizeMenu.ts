/**
 * @description font-size menu
 * @author wangfupeng
 */

import { IDomEditor, IOption } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { FONT_SIZE_SVG } from '../../_helpers/icon-svg'
import { getMenuConf } from '../../_helpers/menu'

class FontSizeMenu extends BaseMenu {
  title = '字号'
  iconSvg = FONT_SIZE_SVG
  mark = 'fontSize'

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { fontSizeList = [] } = getMenuConf(editor, this.mark)

    // 生成 options
    options.push({
      text: '默认',
      value: '', // this.getValue(editor) 未找到结果时，会返回 '' ，正好对应到这里
    })
    fontSizeList.forEach((size: string) => {
      options.push({
        text: size,
        value: size,
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
}

export default FontSizeMenu
