/**
 * @description tooltip 功能
 * @author wangfupeng
 */

import { Dom7Array } from '../../utils/dom'
import { IS_APPLE } from '../../utils/ua'

export function addTooltip(
  $button: Dom7Array,
  iconSvg: string,
  title: string,
  hotkey: string,
  inGroup = false
) {
  if (!iconSvg) {
    // 没有 icon 直接显示 title ，不用 tooltip
    return
  }

  if (hotkey) {
    const fnKey = IS_APPLE ? 'cmd' : 'ctrl' // mac OS 转换为 cmd ，windows 转换为 ctrl
    hotkey = hotkey.replace('mod', fnKey)
  }

  if (inGroup) {
    // in groupButton ，tooltip 只显示 快捷键
    if (hotkey) {
      $button.attr('data-tooltip', hotkey)
      $button.addClass('w-e-menu-tooltip-v5')
      $button.addClass('tooltip-right') // tooltip 显示在右侧
    }
  } else {
    // 非 in groupButton ，正常实现 tooltip
    const tooltip = hotkey ? `${title}\n${hotkey}` : title
    $button.attr('data-tooltip', tooltip)
    $button.addClass('w-e-menu-tooltip-v5')
  }
}
