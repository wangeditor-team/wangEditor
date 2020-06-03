/**
 * @description 创建编辑器实例
 * @author wangfupeng
 */

import Editor from '../../src/editor/index'

/**
 * 创建编辑器实例，用于测试
 * @param document document
 * @param toolbarId toolbar id
 * @param textId text id
 */
function createEditor(document: Document, toolbarId: string, textId?: string): Editor {
    const toolbarElem = document.createElement('div')
    toolbarElem.id = toolbarId

    if (textId) {
        const textElem = document.createElement('div')
        textElem.id = textId

        const editor = new Editor(`#${toolbarId}`, `#${textId}`)
        return editor
    }

    const editor = new Editor(`#${toolbarId}`)
    return editor
}

export default createEditor
