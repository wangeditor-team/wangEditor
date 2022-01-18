/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { VideoElement } from './custom-types'

function parseHtml($elem: Dom7Array, children: Descendant[], editor: IDomEditor): VideoElement {
  let src = ''

  // <iframe> 形式
  const $iframe = $elem.find('iframe')
  if ($iframe.length > 0) {
    src = $iframe[0].outerHTML
  }

  // <video> 形式
  const $video = $elem.find('video')
  if ($video.length > 0) {
    const $source = $video.find('source')
    src = $source.attr('src') || ''
  }

  return {
    type: 'video',
    src,
    children: [{ text: '' }], // void 元素有一个空 text
  }
}

export const parseHtmlConf = {
  selector: 'div[data-w-e-type="video"]',
  parseElemHtml: parseHtml,
}
