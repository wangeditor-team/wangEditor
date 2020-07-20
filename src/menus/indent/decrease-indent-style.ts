/**
 * @description 减少缩进
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'

function decreaseIndentStyle($node: DomElement) {
    const $elem = $node.elems[0]
    if ($elem.style['paddingLeft'] !== '') {
        const oldPL = $elem.style['paddingLeft']
        const oldVal = oldPL.slice(0, oldPL.length - 2)
        const newVal = Number(oldVal) - 2
        if (newVal >= 0) {
            $elem.style['paddingLeft'] = `${newVal}em`
        } else {
            $elem.style['paddingLeft'] = ''
        }
    }
}

export default decreaseIndentStyle
