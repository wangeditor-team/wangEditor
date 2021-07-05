/**
 * @description link menu entry
 * @author wangfupeng
 */

import InsertLink from './InsertLink'
import UpdateLink from './UpdateLink'
import UnLink from './UnLink'
import ViewLink from './ViewLink'
import { genLinkMenuConfig } from './config'

const config = genLinkMenuConfig() // menu config

const insertLinkMenuConf = {
  key: 'insertLink',
  factory() {
    return new InsertLink()
  },

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config,
}

const updateLinkMenuConf = {
  key: 'updateLink',
  factory() {
    return new UpdateLink()
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

export { insertLinkMenuConf, updateLinkMenuConf, unLinkMenuConf, viewLinkMenuConf }
