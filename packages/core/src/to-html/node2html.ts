/**
 * @description node -> html
 * @author wangfupeng
 */

import { Element, Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'
import elemToHtml from './elem2html'
import textToHtml from './text2html'

function node2html(node: Descendant, editor: IDomEditor): string {
  if (Element.isElement(node)) {
    // elem node
    return elemToHtml(node, editor)
  } else {
    // text node
    return textToHtml(node, editor)
  }
}

export default node2html
