/**
 * @description 增加缩进
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'

function increaseIndentStyle($node: DomElement): void {
    const $elem = $node.elems[0]
    if ($elem.style['paddingLeft'] === '') {
        $node.css('padding-left', `2em`)
    } else {
        const oldPL = $elem.style['paddingLeft']
        const oldVal = oldPL.slice(0, oldPL.length - 2)
        const newVal = Number(oldVal) + 2
        $node.css('padding-left', `${newVal}em`)
    }
}

export default increaseIndentStyle
