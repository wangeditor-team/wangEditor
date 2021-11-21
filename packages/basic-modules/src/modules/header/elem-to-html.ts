/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'

function genToHtmlFn(level: number) {
  function headerToHtml(elem: Element, childrenHtml: string): string {
    return `<h${level}>${childrenHtml}</h${level}>`
  }
  return headerToHtml
}

export const header1ToHtmlConf = {
  type: 'header1',
  elemToHtml: genToHtmlFn(1),
}

export const header2ToHtmlConf = {
  type: 'header2',
  elemToHtml: genToHtmlFn(2),
}

export const header3ToHtmlConf = {
  type: 'header3',
  elemToHtml: genToHtmlFn(3),
}

export const header4ToHtmlConf = {
  type: 'header4',
  elemToHtml: genToHtmlFn(4),
}

export const header5ToHtmlConf = {
  type: 'header5',
  elemToHtml: genToHtmlFn(5),
}
