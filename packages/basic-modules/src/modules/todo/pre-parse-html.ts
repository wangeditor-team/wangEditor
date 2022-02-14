/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { DOMElement } from '../../utils/dom'

/**
 * pre-prase todo ，兼容 V4
 * @param elem elem
 */
function preParse(elem: DOMElement): DOMElement {
  const $elem = $(elem)

  // $elem 格式如
  // <ul class="w-e-todo"><li><span contenteditable="false"><input type="checkbox"/></span>hello <b>world</b></li></ul>
  const $li = $elem.find('li')

  const $container = $('<div data-w-e-type="todo"></div>')

  // 1. 把 input 移动到 $container
  const $input = $li.find('input[type]')
  $container.append($input)

  // 2. 删除之前包裹 input 的 span
  const $spanForInput = $li.children()[0]
  $spanForInput.remove()

  // 3. 再把剩余的内容移动到 $container （有纯文本内容，不能用 children ，得用 innerHTML）
  $container[0].innerHTML = $container[0].innerHTML + $li[0].innerHTML

  return $container[0]
}

export const preParseHtmlConf = {
  selector: 'ul.w-e-todo', // 匹配 v4 todo
  preParseHtml: preParse,
}
