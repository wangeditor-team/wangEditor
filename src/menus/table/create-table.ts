/**
 * @description 创建tabel
 * @author lichunlin
 */

import Editor from '../../editor/index'
import $ from '../../utils/dom-core'

class CreateTable {
    private editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * 执行创建
     * @param lineValue 行数
     * @param rowValue 列数
     */
    public createAction(lineValue: number, rowValue: number) {
        const editor = this.editor
        const tableDom: string = this.createRange(lineValue, rowValue)
        editor.cmd.do('insertHTML', tableDom)
    }

    /**
     * 创建table、行、列
     * @param lineValue 行数
     * @param rowValue 列数
     */
    public createRange(lineValue: number, rowValue: number): string {
        let lineStr: string = ''
        let rowStr: string = ''
        for (let i = 0; i < lineValue; i++) {
            rowStr = ''
            for (let j = 0; j < rowValue; j++) {
                if (i === 0) {
                    rowStr = rowStr + '<th></th>'
                } else {
                    rowStr = rowStr + '<td></td>'
                }
            }
            lineStr = lineStr + '<tr>' + rowStr + '</tr>'
        }
        const tableDom =
            `<table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody>` +
            lineStr +
            '</tbody></table>'
        return tableDom
    }
}

export default CreateTable
