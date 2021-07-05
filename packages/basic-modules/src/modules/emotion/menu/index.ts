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

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config: {
    emotions: genConfig(),
  },
}
