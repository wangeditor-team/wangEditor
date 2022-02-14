/**
 * @description pre-parse html
 * @author wangfupeng
 */

import $, { DOMElement, getStyleValue } from '../../utils/dom'

/**
 * pre-prase text-indent 兼容 V4 和 V5 早期格式（都使用 padding-left）
 * @param elem elem
 */
function preParse(elem: DOMElement): DOMElement {
  const $elem = $(elem)
  const paddingLeft = getStyleValue($elem, 'padding-left')

  if (/\dem/.test(paddingLeft)) {
    // 如 '2em' ，V4 格式
    $elem.css('text-indent', '2em')
  }

  if (/\dpx/.test(paddingLeft)) {
    // px 单位
    const num = parseInt(paddingLeft, 10)
    if (num % 32 === 0) {
      // 如 32px 64px ，V5 早期格式
      $elem.css('text-indent', '2em')
    }
  }

  return $elem[0]
}

export const preParseHtmlConf = {
  selector: 'p,h1,h2,h3,h4,h5',
  preParseHtml: preParse,
}
