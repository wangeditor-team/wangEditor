/**
 * @description 对节点 操作 进行封装
 *                  获取当前节点的段落
 *                  根据type判断是增加还是减少缩进
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import increaseIndentStyle from './increase-indent-style'
import decreaseIndentStyle from './decrease-indent-style'

function operateElement($node: DomElement, type: String, editor: Editor): void {
    const $elem = $node.getNodeTop(editor)
    const reg = /^P$/i

    if (reg.test($elem.getNodeName())) {
        if (type === 'increase') increaseIndentStyle($elem)
        else if (type === 'decrease') decreaseIndentStyle($elem)
    }
}

export default operateElement
