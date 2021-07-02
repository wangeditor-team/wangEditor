/**
 * @description menu entry
 * @author wangfupeng
 */

import HeaderSelectMenu from './HeaderSelectMenu'
import Header1ButtonMenu from './Header1ButtonMenu'
import Header2ButtonMenu from './Header2ButtonMenu'
import Header3ButtonMenu from './Header3ButtonMenu'

export const HeaderSelectMenuConf = {
  key: 'headerSelect',
  factory() {
    return new HeaderSelectMenu()
  },
}

export const Header1ButtonMenuConf = {
  key: 'header1',
  factory() {
    return new Header1ButtonMenu()
  },
}

export const Header2ButtonMenuConf = {
  key: 'header2',
  factory() {
    return new Header2ButtonMenu()
  },
}

export const Header3ButtonMenuConf = {
  key: 'header3',
  factory() {
    return new Header3ButtonMenu()
  },
}
