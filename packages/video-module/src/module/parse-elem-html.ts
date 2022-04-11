/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { VideoElement } from './custom-types'
import $, { DOMElement } from '../utils/dom'

function genVideoElem(src: string): VideoElement {
  return {
    type: 'video',
    src,
    children: [{ text: '' }], // void 元素有一个空 text
  }
}

function parseHtml(elem: DOMElement, children: Descendant[], editor: IDomEditor): VideoElement {
  const $elem = $(elem)
  let src = ''

  // <iframe> 形式
  const $iframe = $elem.find('iframe')
  if ($iframe.length > 0) {
    src = $iframe[0].outerHTML
    return genVideoElem(src)
  }

  // <video> 形式
  const $video = $elem.find('video')
  src = $video.attr('src') || ''
  if (!src) {
    if ($video.length > 0) {
      const $source = $video.find('source')
      src = $source.attr('src') || ''
    }
  }
  return genVideoElem(src)
}

export const parseHtmlConf = {
  selector: 'div[data-w-e-type="video"]',
  parseElemHtml: parseHtml,
}
