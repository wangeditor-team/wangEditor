/**
 * @description code-block menu
 * @author wangfupeng
 */

import CodeBlockMenu from './CodeBlockMenu'
import SelectLangMenu from './SelectLangMenu'
import { genCodeLangs } from './config'

export const codeBlockMenuConf = {
  key: 'codeBlock',
  factory() {
    return new CodeBlockMenu()
  },
}

export const selectLangMenuConf = {
  key: 'codeSelectLang',
  factory() {
    return new SelectLangMenu()
  },
  config: {
    codeLangs: genCodeLangs(),
  },
}
