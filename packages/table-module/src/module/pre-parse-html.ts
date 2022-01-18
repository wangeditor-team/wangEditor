/**
 * @description pre parse html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import { getTagName } from '../utils/dom'

/**
 * pre-prase table ，去掉 <tbody>
 * @param $table $table
 */
function preParse($table: Dom7Array) {
  const tagName = getTagName($table)
  if (tagName !== 'table') return $table

  // 没有 <tbody> 则直接返回
  const $tbody = $table.find('tbody')
  if ($tbody.length === 0) return $table

  // 去掉 <tbody> ，把 <tr> 移动到 <table> 下面
  const $tr = $table.find('tr')
  $table.append($tr)
  $tbody.remove()

  return $table
}

export const preParseTableHtmlConf = {
  selector: 'table',
  preParseHtml: preParse,
}
