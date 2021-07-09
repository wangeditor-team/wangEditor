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

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config: {
    emotions: genConfig(),
  },
}
