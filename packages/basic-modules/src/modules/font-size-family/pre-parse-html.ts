/**
 * @description pre-parse html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { getTagName } from '../../utils/dom'

// V4 font-size 对应关系（V4 使用 <font size="1">xxx</font> 格式）
const FONT_SIZE_MAP_FOR_V4 = {
  '1': '12px',
  '2': '14px',
  '3': '16px',
  '4': '19px',
  '5': '24px',
  '6': '32px',
  '7': '48px',
}

/**
 * pre-prase font ，兼容 V4
 * @param $font $font
 */
function preParse($font: Dom7Array) {
  const tagName = getTagName($font)
  if (tagName !== 'font') return $font

  // 处理 size （V4 使用 <font size="1">xxx</font> 格式）
  const size = $font.attr('size') || ''
  if (size) {
    $font.removeAttr('size')
    $font.css('font-size', FONT_SIZE_MAP_FOR_V4[size])
  }

  // 处理 face （V4 使用 <font face="黑体">xx</font> 格式）
  const face = $font.attr('face') || ''
  if (face) {
    $font.removeAttr('face')
    $font.css('font-family', face)
  }

  return $font
}

export const preParseHtmlConf = {
  selector: 'font',
  preParseHtml: preParse,
}
