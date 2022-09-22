/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { DOMElement, getTagName } from '../utils/dom'

/**
 * pre-prase - <ul> 或 <ol> 转换为 <div data-w-e-fragment>
 * @param elem elem
 */
function preParse(elem: DOMElement): DOMElement {
  // const $div = $('<div data-w-e-fragment></div>')

  // const $elem = $(elem)
  // const tagName = getTagName($elem)

  // Array.from($elem.children()).forEach(item => {
  //   const $item = $(item)
  //   const itemTagName = getTagName($item)
  //   if (itemTagName != 'li') return

  //   // 标记 ordered
  //   if (tagName === 'ol') {
  //     $item.attr('data-list-item-ordered', 'true')
  //   }

  //   // TODO 编辑 level

  //   $div.append($item)
  // })

  // console.log(123123, $div[0].outerHTML)

  // return $div[0]
  return elem
}

export default {
  selector: 'ul:not([data-w-e-type]),ol:not([data-w-e-type])',
  preParseHtml: preParse,
}
