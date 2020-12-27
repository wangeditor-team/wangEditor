import Editor from '../../../editor'
import { DomElement } from '../../../utils/dom-core'
import SelectionRangeElem from '../SelectionRangeElem'

export type HandlerListOptions = {
    editor: Editor
    listType: string
    lsitTarget: string
    selectionRangeElem: SelectionRangeElem
    $selectionElem: DomElement
    $startElem: DomElement
    $endElem: DomElement
}

export interface Exec {
    exec: Function
}

export class ListHandle {
    public options: HandlerListOptions

    constructor(options: HandlerListOptions) {
        this.options = options
    }
}
