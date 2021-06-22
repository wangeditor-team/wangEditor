/**
 * @description node -> html
 * @author wangfupeng
 */

import { Element, Node } from 'slate'
import { IDomEditor } from '../editor/dom-editor'
import elemToHtml from './elem2html'
import textToHtml from './text2html'

export function node2html(node: Node, editor: IDomEditor): string {
  if (Element.isElement(node)) {
    // elem node
    return elemToHtml(node, editor)
  } else {
    // text node
    return textToHtml(node, editor)
  }
}
