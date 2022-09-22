/**
 * @description menu entry
 * @author wangfupeng
 */

import BulletedListMenu from './BulletedListMenu'
import NumberedListMenu from './NumberedListMenu'

export const bulletedListMenuConf = {
  key: 'bulletedList2',
  factory() {
    return new BulletedListMenu()
  },
}

export const numberedListMenuConf = {
  key: 'numberedList2',
  factory() {
    return new NumberedListMenu()
  },
}
