/**
 * @description 粘贴 text html
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { getPasteText, getPasteHtml } from '../paste/paste-event'
import { isFunction } from '../../utils/util'
import $ from '../../utils/dom-core'

/**
 * 粘贴文本和 html
 * @param editor 编辑器对象
 * @param pasteEvents 粘贴事件列表
 */

function _foramthtml(val: string) {
    let pasteText = val
    pasteText = pasteText.replace(/<br>|<br\/>/gim, '')

    // div 全部替换为 p 标签
    pasteText = pasteText.replace(/<div>/gim, '<p>').replace(/<\/div>/gim, '</p>')

    // 不允许空行，放在最后
    pasteText = pasteText.replace(/<p><\/p>/gim, '<p><br></p>')
    return pasteText
}

function pasteTextHtml(editor: Editor, pasteEvents: Function[]) {
    function fn(e: Event) {
        // 获取配置
        const config = editor.config
        const pasteFilterStyle = config.pasteFilterStyle
        const pasteIgnoreImg = config.pasteIgnoreImg
        const pasteTextHandle = config.pasteTextHandle

        // 获取粘贴的文字
        let pasteHtml = getPasteHtml(e as ClipboardEvent, pasteFilterStyle, pasteIgnoreImg)
        let pasteText = getPasteText(e as ClipboardEvent)
        pasteText = pasteText.replace(/\n/gm, '<br>')

        // 获取选取
        const _range = editor.selection.getRange()
        // 当前选区所在的 DOM 节点
        const $selectionElem = editor.selection.getSelectionContainerElem()
        // 获取end的偏移位置
        //   var end = _range?.endOffset

        if (!$selectionElem) {
            return
        }
        const nodeName = $selectionElem.getNodeName()

        // code 中只能粘贴纯文本
        if (nodeName === 'CODE' || nodeName === 'PRE') {
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '')
            }
            editor.cmd.do('insertHTML', `<p>${_foramthtml(pasteText)}</p>`)
            return
        }

        // table 中（td、th），待开发。。。

        if (!pasteHtml) {
            return
        }

        try {
            // firefox 中，获取的 pasteHtml 可能是没有 <ul> 包裹的 <li>
            // 因此执行 insertHTML 会报错
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteHtml = '' + (pasteTextHandle(pasteHtml) || '') // html
            }
            editor.cmd.do('insertHTML', _foramthtml(pasteHtml))
        } catch (ex) {
            // 此时使用 pasteText 来兼容一下
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '')
            }
            editor.cmd.do('insertHTML', `<p>${_foramthtml(pasteText)}</p>`) // text
        } finally {
            // 粘贴之后，统一进行格式化
            //   editor.txt.formatHtml()
            // 忽略 <br> 换行
            // if (end) {
            //     _range?.setStart($selectionElem.elems[0], end)
            //     _range?.setEnd($selectionElem.elems[0], end)
            // }
        }
    }
    pasteEvents.push(fn)
}

export default pasteTextHtml
