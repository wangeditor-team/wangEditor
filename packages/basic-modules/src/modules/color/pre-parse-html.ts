/**
 * @description pre-parse html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { getTagName } from '../../utils/dom'

/**
 * pre-prase font ，兼容 V4
 * @param $font $font
 */
function preParse($font: Dom7Array) {
  const tagName = getTagName($font)
  if (tagName !== 'font') return $font

  // 处理 color （V4 使用 <font color="#ccc">xx</font> 格式）
  const color = $font.attr('color') || ''
  if (color) {
    $font.removeAttr('color')
    $font.css('color', color)
  }

  return $font
}

export const preParseHtmlConf = {
  selector: 'font',
  preParseHtml: preParse,
}
