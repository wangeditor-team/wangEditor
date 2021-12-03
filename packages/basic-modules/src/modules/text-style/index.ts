/**
 * @description text style entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './text-style'
import { textToHtml } from './text-to-html'
import {
  boldMenuConf,
  underlineMenuConf,
  italicMenuConf,
  throughMenuConf,
  codeMenuConf,
  subMenuConf,
  supMenuConf,
  clearStyleMenuConf,
} from './menu/index'
import withTextStyle from './plugin'

const textStyle: Partial<IModuleConf> = {
  renderTextStyle,
  menus: [
    boldMenuConf,
    underlineMenuConf,
    italicMenuConf,
    throughMenuConf,
    codeMenuConf,
    subMenuConf,
    supMenuConf,
    clearStyleMenuConf,
  ],
  textToHtml,
  editorPlugin: withTextStyle,
}

export default textStyle
