/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { ImageElement } from './custom-types'
import { getStyleValue } from '../../utils/dom'

function parseHtml($elem: Dom7Array, children: Descendant[], editor: IDomEditor): ImageElement {
  let href = $elem.attr('data-href') || ''
  href = decodeURIComponent(href) // 兼容 V4

  return {
    type: 'image',
    src: $elem.attr('src') || '',
    alt: $elem.attr('alt') || '',
    href,
    style: {
      width: getStyleValue($elem, 'width'),
      height: getStyleValue($elem, 'height'),
    },
    children: [{ text: '' }], // void node 有一个空白 text
  }
}

export const parseHtmlConf = {
  selector: 'img',
  parseElemHtml: parseHtml,
}
