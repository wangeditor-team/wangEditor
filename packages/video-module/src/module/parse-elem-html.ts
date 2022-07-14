/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { VideoElement } from './custom-types'
import $, { DOMElement } from '../utils/dom'

function genVideoElem(
  src: string,
  poster: string = '',
  width = 'auto',
  height = 'auto'
): VideoElement {
  return {
    type: 'video',
    src,
    poster,
    width,
    height,
    children: [{ text: '' }], // void 元素有一个空 text
  }
}

function parseHtml(elem: DOMElement, children: Descendant[], editor: IDomEditor): VideoElement {
  const $elem = $(elem)
  let src = ''
  let poster = ''
  let width = 'auto'
  let height = 'auto'

  // <iframe> 形式
  const $iframe = $elem.find('iframe')
  if ($iframe.length > 0) {
    width = $iframe.attr('width') || 'auto'
    height = $iframe.attr('height') || 'auto'
    src = $iframe[0].outerHTML
    return genVideoElem(src, poster, width, height)
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
  width = $video.attr('width') || 'auto'
  height = $video.attr('height') || 'auto'
  poster = $video.attr('poster') || ''
  return genVideoElem(src, poster, width, height)
}

export const parseHtmlConf = {
  selector: 'div[data-w-e-type="video"]',
  parseElemHtml: parseHtml,
}
