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
        // p 标签 只考虑 创建列表
        if (type === 'disorder') setDisorderNode($elem, editor)
        else if (type === 'order') setOrderNode($elem, editor)
    } else {
        // 非 p 标签
        if (type === 'disorder') {
            if (reg3.test($elem.getNodeName())) {
                // 标签为 ol 的时候 代表 有序 转 无序
                setDisorderNode($elem, editor, 'li')
            } else if (reg2.test($elem.getNodeName())) {
                // 标签为 ul  取消 序列
                cancelDisOrderNode($elem, editor)
            }
        } else if (type === 'order') {
            if (reg2.test($elem.getNodeName())) {
                // 标签为 ul 的时候 代表 无序 转 有序
                setOrderNode($elem, editor, 'li')
            } else if (reg3.test($elem.getNodeName())) {
                // 标签为 ol  取消 序列
                cancelOrderNode($elem, editor)
            }
        }
    }
}

export default operateElement
