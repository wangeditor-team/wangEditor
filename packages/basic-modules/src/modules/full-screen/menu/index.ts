/**
 * @description menu entry
 * @author wangfupeng
 */

import FullScreen from './FullScreen'

export const fullScreenConf = {
  key: 'fullScreen',
  factory() {
    return new FullScreen()
  },
}
