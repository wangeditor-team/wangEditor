/**
 * @description 对节点 操作 进行封装
 *                  获取当前节点的段落
 *                  根据type判断是增加还是减少缩进
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import getParagraph from './get-paragraph'
import increaseIndentStyle from './increase-indent-style'
import reduceIndentStyle from './reduce-indent-style'

function operateElement($node: DomElement, type: String, editor: Editor) {
    const $elem = getParagraph($node, editor)
    if (type === 'increase') increaseIndentStyle($elem)
    else if (type === 'reduce') reduceIndentStyle($elem)
}

export default operateElement
