/**
 * @description 创建编辑器实例
 * @author wangfupeng
 */

import Editor from '../../src/editor/index'
import $ from 'jquery'

/**
 * 创建编辑器实例，用于测试
 * @param document document
 * @param toolbarId toolbar id
 * @param textId text id
 */
function createEditor(document: Document, toolbarId: string, textId?: string): Editor {
    const toolbarElem = document.createElement('div')
    toolbarElem.id = toolbarId
    $('body').append($(toolbarElem))

    let editor: Editor

    if (textId) {
        const textElem = document.createElement('div')
        textElem.id = textId
        $('body').append($(textElem))
        editor = new Editor(`#${toolbarId}`, `#${textId}`)
    }

    editor = new Editor(`#${toolbarId}`)

    editor.create()
    return editor
}

export default createEditor
