import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { getNodeTop } from '../../utils/util'
import setDisorderNode from './set-disorder-node'
import setOrderNode from './set-order-node'
import cancelDisOrderNode from './cancel-disorder-node'
import cancelOrderNode from './cancel-order-node'

function operateElement($node: DomElement, type: String, editor: Editor): void {
    const $elem = getNodeTop($node, editor)
    const reg1 = /^P$/i
    const reg2 = /^UL$/i
    const reg3 = /^OL$/i
    if (reg1.test($elem.getNodeName())) {
        if (type === 'disorder') setDisorderNode($elem, editor)
        else if (type === 'order') setOrderNode($elem, editor)
    } else if (reg2.test($elem.getNodeName()) || reg3.test($elem.getNodeName())) {
        if (type === 'disorder') cancelDisOrderNode($elem, editor)
        else if (type === 'order') cancelOrderNode($elem, editor)
    }
}

export default operateElement
