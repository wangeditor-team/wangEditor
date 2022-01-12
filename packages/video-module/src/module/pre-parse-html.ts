/**
 * @description pre parse html
 * @author wangfupeng
 */

import { Dom7Array } from 'dom7'
import $, { getTagName } from '../utils/dom'

/**
 * pre-prase video ，兼容 V4
 * @param $video $video
 */
function preParse($video: Dom7Array) {
  const tagName = getTagName($video)
  if (tagName !== 'iframe' && tagName !== 'video') return $video

  // 已经符合 V5 格式
  const $parent = $video.parent()
  if ($parent.attr('data-w-e-type') === 'video') return $video

  const $container = $(`<div data-w-e-type="video" data-w-e-isVoid></div>`)
  $container.append($video)

  return $container
}

export const preParseHtmlConf = {
  selector: 'iframe,video',
  preParseHtml: preParse,
}
