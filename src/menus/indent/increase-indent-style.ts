/**
 * @description 增加缩进
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'

function increaseIndentStyle($node: DomElement) {
    const $elem = $node.elems[0]
    if ($elem.style['paddingLeft'] === '') {
        $elem.style['paddingLeft'] = '2em'
    } else {
        const oldPL = $elem.style['paddingLeft']
        const oldVal = oldPL.slice(0, oldPL.length - 2)
        const newVal = Number(oldVal) + 2
        $elem.style['paddingLeft'] = `${newVal}em`
    }
}

export default increaseIndentStyle
