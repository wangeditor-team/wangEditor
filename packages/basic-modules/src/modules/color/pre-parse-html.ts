/**
 * @description pre-parse html
 * @author wangfupeng
 */

import $, { DOMElement, getTagName } from '../../utils/dom'

/**
 * pre-prase font ，兼容 V4
 * @param fontElem fontElem
 */
function preParse(fontElem: DOMElement): DOMElement {
  const $font = $(fontElem)
  const tagName = getTagName($font)
  if (tagName !== 'font') return fontElem

  // 处理 color （V4 使用 <font color="#ccc">xx</font> 格式）
  const color = $font.attr('color') || ''
  if (color) {
    $font.removeAttr('color')
    $font.css('color', color)
  }

  return $font[0]
}

export const preParseHtmlConf = {
  selector: 'font',
  preParseHtml: preParse,
}
