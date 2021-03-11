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
function createEditor(
    document: Document,
    toolbarId: string,
    textId?: string,
    config?: any,
    htmlStr?: string
): Editor {
    const toolbarElem = document.createElement('div')
    toolbarElem.id = toolbarId
    $('body').append($(toolbarElem))

    let editor: Editor

    if (textId) {
        const textElem = document.createElement('div')
        textElem.id = textId
        $('body').append($(textElem))
        if (htmlStr) {
            textElem.innerHTML = htmlStr
        }
        editor = new Editor(`#${toolbarId}`, `#${textId}`)
    } else {
        editor = new Editor(`#${toolbarId}`)
    }

    if (config) {
        for (const key in config) {
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                ;(editor.config as any)[key] = config[key]
            }
        }
    }

    editor.create()
    return editor
}

export default createEditor
