/**
 * @description text style entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { genMenuConf } from './menu/index'
import { BOLD_SVG, UNDER_LINE_SVG, ITALIC_SVG, THROUGH_SVG, CODE_SVG } from '../_helpers/icon-svg'

const boldMenuConf = genMenuConf('bold', '加粗', BOLD_SVG)

const underlineMenuConf = genMenuConf('underline', '下划线', UNDER_LINE_SVG)

const italicMenuConf = genMenuConf('italic', '斜体', ITALIC_SVG)

const throughMenuConf = genMenuConf('through', '删除线', THROUGH_SVG)

const codeMenuConf = genMenuConf('code', '行内代码', CODE_SVG)

const textStyle: IModuleConf = {
  addTextStyle,
  menus: [boldMenuConf, underlineMenuConf, italicMenuConf, throughMenuConf, codeMenuConf],
}

export default textStyle
