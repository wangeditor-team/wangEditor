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

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
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
