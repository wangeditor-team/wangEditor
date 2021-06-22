/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function imageToHtml(elemNode: Element, childrenHtml: string, editor: IDomEditor): string {
  // @ts-ignore
  const { src, alt = '', url = '', style = {} } = elemNode
  const { width = '', height = '' } = style

  let styleStr = ''
  if (width) styleStr += `width: ${width};`
  if (height) styleStr += `height: ${height};`
  return `<img src="${src}" alt="${alt}" data-href="${url}" style="${styleStr}"/>`
}

export const imageToHtmlConf = {
  type: 'image',
  elemToHtml: imageToHtml,
}
