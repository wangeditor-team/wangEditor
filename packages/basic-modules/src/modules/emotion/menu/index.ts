/**
 * @description emotion menu
 * @author wangfupeng
 */

import EmotionMenu from './EmotionMenu'
import { genConfig } from './config'

export const emotionMenuConf = {
  key: 'emotion',
  factory() {
    return new EmotionMenu()
  },

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config: {
    emotions: genConfig(),
  },
}
