/**
 * @description code-highlight menu
 * @author wangfupeng
 */

import SelectLangMenu from './SelectLangMenu'
import { genCodeLangs } from './config'

export const selectLangMenuConf = {
  key: 'codeSelectLang',
  factory() {
    return new SelectLangMenu()
  },
  config: {
    codeLangs: genCodeLangs(),
  },
}
