/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { getTagName, DOMElement } from '../utils/dom'

/**
 * pre-prase table ，去掉 <tbody>
 * @param table table elem
 */
function preParse(tableElem: DOMElement): DOMElement {
  const $table = $(tableElem)
  const tagName = getTagName($table)
  if (tagName !== 'table') return tableElem

  // 没有 <tbody> 则直接返回
  const $tbody = $table.find('tbody')
  if ($tbody.length === 0) return tableElem

  // 去掉 <tbody> ，把 <tr> 移动到 <table> 下面
  const $tr = $table.find('tr')
  $table.append($tr)
  $tbody.remove()

  return $table[0]
}

export const preParseTableHtmlConf = {
  selector: 'table',
  preParseHtml: preParse,
}
