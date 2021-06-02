/**
 * @description link menu entry
 * @author wangfupeng
 */

import InsertLink from './InsertLink'
import UpdateLink from './UpdateLink'
import UnLink from './UnLink'
import ViewLink from './ViewLink'

const insertLinkMenuConf = {
  key: 'insertLink',
  factory() {
    return new InsertLink()
  },
}

const updateLinkMenuConf = {
  key: 'updateLink',
  factory() {
    return new UpdateLink()
  },
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
