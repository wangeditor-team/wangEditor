/**
 * @description 创建编辑器实例
 * @author tonghan
 */

import i18next from 'i18next'
import Editor from '../../src/editor/index'
import $ from 'jquery'

/**
 * 创建编辑器实例，用于测试
 * @param document document
 * @param toolbarId toolbar id
 * @param textId text id
 */
function createEditor(document: Document, toolbarId: string, lang?: string): Editor {
    const toolbarElem = document.createElement('div')
    toolbarElem.id = toolbarId
    $('body').append($(toolbarElem))

    let editor: Editor

    editor = new Editor(`#${toolbarId}`)
    if (lang) editor.config.lang = lang
    editor.i18next = i18next

    editor.create()
    return editor
}

export default createEditor
