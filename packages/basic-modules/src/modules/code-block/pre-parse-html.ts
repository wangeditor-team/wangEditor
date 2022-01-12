/**
 * @description pre parse html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { getTagName } from '../../utils/dom'

/**
 * pre-prase <code> ，去掉其中的 <xmp> （兼容 V4）
 * @param $code $code
 */
function preParse($code: Dom7Array) {
  const tagName = getTagName($code)
  if (tagName !== 'code') return $code

  const $xmp = $code.find('xmp')
  if ($xmp.length === 0) return $code // 不是 V4 格式

  const codeText = $xmp.text()
  $xmp.remove()
  $code.text(codeText)

  return $code
}

export const preParseHtmlConf = {
  selector: 'pre>code', // 匹配 <pre> 下的 <code>
  preParseHtml: preParse,
}
