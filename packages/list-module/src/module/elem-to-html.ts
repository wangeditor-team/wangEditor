/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { genTag } from './_helpers/node'

function genElemToHtmlFn(type: string) {
  const tag = genTag(type)

  function toHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
    return `<${tag}>${childrenHtml}</${tag}>`
  }

  return toHtml
}

export const bulletedToHtmlConf = {
  type: 'bulleted-list',
  elemToHtml: genElemToHtmlFn('bulleted-list'),
}

export const numberedToHtmlConf = {
  type: 'numbered-list',
  elemToHtml: genElemToHtmlFn('numbered-list'),
}

export const listItemToHtmlConf = {
  type: 'list-item',
  elemToHtml: genElemToHtmlFn('list-item'),
}
