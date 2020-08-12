import $, { DomElement } from '../../../../utils/dom-core'

/**
 * 处理新添加行
 * @param $node 整个table
 * @param _index 行的inde
 */
function ProcessingRow($node: DomElement, _index: number): DomElement {
    let $dom = $node.elems[0].childNodes[0]
    //取出所有的行
    let domArray: Node[] = Array.prototype.slice.apply($dom.childNodes)
    //列的数量
    const childNodesLenght = domArray[0].childNodes.length
    //创建新tr
    let tr = document.createElement('tr')
    for (let i = 0; i < childNodesLenght; i++) {
        const td = document.createElement('td')
        tr.appendChild(td)
    }
    //插入集合中
    domArray.splice(_index + 1, 0, tr)
    //移除所有的旧的子节点
    while ($dom.childNodes.length !== 0) {
        $dom.removeChild($dom.childNodes[0])
    }
    //插入新的子节点
    for (let i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i])
    }
    return $($dom.parentNode)
}

/**
 * 处理新添加列
 * @param $node 整个table
 * @param _index 列的inde
 */
function ProcessingCol($node: DomElement, _index: number): DomElement {
    let $dom = $node.elems[0].childNodes[0]
    //取出所有的行
    let domArray: Node[] = Array.prototype.slice.apply($dom.childNodes)
    //创建td
    for (let i = 0; i < domArray.length; i++) {
        let cArray: Node[] = []
        //取出所有的列
        domArray[i].childNodes.forEach(item => {
            cArray.push(item)
        })
        //移除行的旧的子节点
        while (domArray[i].childNodes.length !== 0) {
            domArray[i].removeChild(domArray[i].childNodes[0])
        }
        //列分th td
        let td =
            $(cArray[0]).getNodeName() !== 'TH'
                ? document.createElement('td')
                : document.createElement('th')
        // let td = document.createElement('td')
        cArray.splice(_index + 1, 0, td)
        //插入新的子节点
        for (let j = 0; j < cArray.length; j++) {
            domArray[i].appendChild(cArray[j])
        }
    }
    //移除所有的旧的子节点
    while ($dom.childNodes.length !== 0) {
        $dom.removeChild($dom.childNodes[0])
    }
    //插入新的子节点
    for (let i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i])
    }
    return $($dom.parentNode)
}

/**
 * 处理删除行
 * @param $node  整个table
 * @param _index  行的inde
 */
function DeleteRow($node: DomElement, _index: number): DomElement {
    let $dom = $node.elems[0].childNodes[0]
    //取出所有的行
    let domArray: Node[] = Array.prototype.slice.apply($dom.childNodes)
    //删除行
    domArray.splice(_index, 1)
    //移除所有的旧的子节点
    while ($dom.childNodes.length !== 0) {
        $dom.removeChild($dom.childNodes[0])
    }
    //插入新的子节点
    for (let i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i])
    }
    return $($dom.parentNode)
}

/**
 * 处理删除列
 * @param $node
 * @param _index
 */
function DeleteCol($node: DomElement, _index: number): DomElement {
    let $dom = $node.elems[0].childNodes[0]
    //取出所有的行
    let domArray: Node[] = Array.prototype.slice.apply($dom.childNodes)
    //创建td
    for (let i = 0; i < domArray.length; i++) {
        let cArray: Node[] = []
        //取出所有的列
        domArray[i].childNodes.forEach(item => {
            cArray.push(item)
        })
        //移除行的旧的子节点
        while (domArray[i].childNodes.length !== 0) {
            domArray[i].removeChild(domArray[i].childNodes[0])
        }
        cArray.splice(_index, 1)
        //插入新的子节点
        for (let j = 0; j < cArray.length; j++) {
            domArray[i].appendChild(cArray[j])
        }
    }
    //移除所有的旧的子节点
    while ($dom.childNodes.length !== 0) {
        $dom.removeChild($dom.childNodes[0])
    }
    //插入新的子节点
    for (let i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i])
    }
    return $($dom.parentNode)
}

/**
 * 处理设置/取消表头
 * @param $node
 * @param _index
 * @type 替换的列 th 还是td
 */
function setTheHeader($node: DomElement, _index: number, type: string): DomElement {
    let $dom = $node.elems[0].childNodes[0]
    //取出所有的行
    let domArray: Node[] = Array.prototype.slice.apply($dom.childNodes)
    //列的数量
    const childNodesLenght = domArray[_index].childNodes
    //创建新tr
    let tr = document.createElement('tr')
    for (let i = 0; i < childNodesLenght.length; i++) {
        //替换td为th
        const th = document.createElement(type)
        childNodesLenght[i].childNodes.forEach(item => {
            th.appendChild(item)
        })
        tr.appendChild(th)
    }
    //插入集合中
    domArray.splice(_index, 1, tr)
    //移除所有的旧的子节点
    while ($dom.childNodes.length !== 0) {
        $dom.removeChild($dom.childNodes[0])
    }
    //插入新的子节点
    for (let i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i])
    }
    return $($dom.parentNode)
}

export default {
    ProcessingRow,
    ProcessingCol,
    DeleteRow,
    DeleteCol,
    setTheHeader,
}
