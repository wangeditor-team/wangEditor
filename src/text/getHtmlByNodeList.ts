/**
 * @description 从nodeList json格式中遍历生成dom元素
 * @author zhengwenjian
 */

import $, { DomElement } from './../utils/dom-core'
import { NodeListType } from './getChildrenJSON'

function getHtmlByNodeList(nodeList: NodeListType): DomElement {
    // 设置一个父节点存储所有子节点
    let $root = $(`<div></div>`)

    // 遍历节点JSON
    nodeList.forEach(item => {
        let $elem: DomElement = $('')

        // 当为文本节点时
        if (typeof item === 'string') {
            $elem = $(`<span>${item}</span>`)
        }

        // 当为普通节点时
        if (typeof item === 'object') {
            $elem = $(`<${item.tag}></${item.tag}>`)
            item.attrs.forEach(attr => {
                $elem.attr(attr.name, attr.value)
            })

            // 有子节点时递归将子节点加入当前节点
            if (item.children && item.children.length > 0) {
                const $elemChilds = getHtmlByNodeList(item.children).children()
                $elemChilds && $elem.append($elemChilds)
            }
        }

        $root.append($elem)
    })
    return $root
}

export default getHtmlByNodeList
