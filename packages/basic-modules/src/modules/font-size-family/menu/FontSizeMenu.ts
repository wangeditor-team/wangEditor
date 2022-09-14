/**
 * @description font-size menu
 * @author wangfupeng
 */

import { IDomEditor, IOption, t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { FONT_SIZE_SVG } from '../../../constants/icon-svg'

class FontSizeMenu extends BaseMenu {
  readonly title = t('fontSize.title')
  readonly iconSvg = FONT_SIZE_SVG
  readonly mark = 'fontSize'

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { fontSizeList = [] } = editor.getMenuConfig(this.mark)

    // 生成 options
    options.push({
      text: t('fontSize.default'),
      value: '', // this.getValue(editor) 未找到结果时，会返回 '' ，正好对应到这里
    })
    fontSizeList.forEach((size: string | { name: string; value: string }) => {
      if (typeof size === 'string') {
        options.push({
          text: size,
          value: size,
        })
      } else if (typeof size === 'object') {
        const { name, value } = size
        options.push({
          text: name,
          value: value,
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

export default FontSizeMenu
