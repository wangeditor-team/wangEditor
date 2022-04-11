/**
 * @description menu entry
 * @author wangfupeng
 */

import BoldMenu from './BoldMenu'
import CodeMenu from './CodeMenu'
import ItalicMenu from './ItalicMenu'
import ThroughMenu from './ThroughMenu'
import UnderlineMenu from './UnderlineMenu'
import SubMenu from './SubMenu'
import SupMenu from './SupMenu'
import ClearStyleMenu from './ClearStyleMenu'

export const boldMenuConf = {
  key: 'bold',
  factory() {
    return new BoldMenu()
  },
}

export const codeMenuConf = {
  key: 'code',
  factory() {
    return new CodeMenu()
  },
}

export const italicMenuConf = {
  key: 'italic',
  factory() {
    return new ItalicMenu()
  },
}

export const throughMenuConf = {
  key: 'through',
  factory() {
    return new ThroughMenu()
  },
}

export const underlineMenuConf = {
  key: 'underline',
  factory() {
    return new UnderlineMenu()
  },
}

export const supMenuConf = {
  key: 'sup',
  factory() {
    return new SupMenu()
  },
}

export const subMenuConf = {
  key: 'sub',
  factory() {
    return new SubMenu()
  },
}

export const clearStyleMenuConf = {
  key: 'clearStyle',
  factory() {
    return new ClearStyleMenu()
  },
}
