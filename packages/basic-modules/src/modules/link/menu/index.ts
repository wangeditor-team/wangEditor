/**
 * @description link menu entry
 * @author wangfupeng
 */

import InsertLink from './InsertLink'
import EditLink from './EditLink'
import UnLink from './UnLink'
import ViewLink from './ViewLink'
import { genLinkMenuConfig } from './config'

const config = genLinkMenuConfig() // menu config

const insertLinkMenuConf = {
  key: 'insertLink',
  factory() {
    return new InsertLink()
  },

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config,
}

const editLinkMenuConf = {
  key: 'editLink',
  factory() {
    return new EditLink()
  },
  config,
}

const unLinkMenuConf = {
  key: 'unLink',
  factory() {
    return new UnLink()
  },
}

const viewLinkMenuConf = {
  key: 'viewLink',
  factory() {
    return new ViewLink()
  },
}

export { insertLinkMenuConf, editLinkMenuConf, unLinkMenuConf, viewLinkMenuConf }
