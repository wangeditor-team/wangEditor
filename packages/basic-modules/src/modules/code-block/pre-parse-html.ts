/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { DOMElement } from '../../utils/dom'
import { getTagName } from '../../utils/dom'

/**
 * pre-prase <code> ，去掉其中的 <xmp> （兼容 V4）
 * @param codeElem codeElem
 */
function preParse(codeElem: DOMElement): DOMElement {
  const $code = $(codeElem)
  const tagName = getTagName($code)
  if (tagName !== 'code') return codeElem

  const $xmp = $code.find('xmp')
  if ($xmp.length === 0) return codeElem // 不是 V4 格式

  const codeText = $xmp.text()
  $xmp.remove()
  $code.text(codeText)

  return $code[0]
}

export const preParseHtmlConf = {
  selector: 'pre>code', // 匹配 <pre> 下的 <code>
  preParseHtml: preParse,
}
