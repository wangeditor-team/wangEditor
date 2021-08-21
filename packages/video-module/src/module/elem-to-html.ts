/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { VideoElement } from './custom-types'

function videoToHtml(elemNode: Element, childrenHtml: string, editor: IDomEditor): string {
  const { src = '' } = elemNode as VideoElement
  let res = '<div class="wangeditor-video-container">\n'

  if (src.trim().indexOf('<iframe') === 0) {
    // iframe 形式
    res += src
  } else {
    // 其他，mp4 等 url 格式
    res += `<video controls="true"><source src="${src}" type="video/mp4"/></video>`
  }
  res += '\n</div>'

  return res
}

export const videoToHtmlConf = {
  type: 'video',
  elemToHtml: videoToHtml,
}
