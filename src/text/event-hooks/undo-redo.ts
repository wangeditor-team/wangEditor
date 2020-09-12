/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

class Revoke {
    private undoArray: string[]
    private redoArray: string[]

    public editor: Editor

    public undo() {}

    public redo() {}

    public onChangeAfter() {}

    public onCustomActionAfter() {}

    constructor(editor: Editor) {
        this.editor = editor
        this.undoArray = []
        this.redoArray = []
    }
}

export default Revoke
