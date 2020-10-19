/**
 * @description 粘贴图片
 * @author wangfupeng
 */

import Editor from '../../../editor/index'
import { getPasteText, getPasteHtml, getPasteImgs } from '../../../text/paste/paste-event'
import UploadImg from '../upload-img'

/**
 * 剪切板是否有 text 或者 html ？
 * @param editor 编辑器对象
 * @param e 粘贴事件参数
 */
function _haveTextOrHtml(editor: Editor, e: ClipboardEvent): boolean {
    const config = editor.config
    const pasteFilterStyle = config.pasteFilterStyle
    const pasteIgnoreImg = config.pasteIgnoreImg
    let pasteHtml = getPasteHtml(e, pasteFilterStyle, pasteIgnoreImg)
    if (pasteHtml) return true
    let pasteText = getPasteText(e)
    if (pasteText) return true

    return false // text html 都没有，则返回 false
}

/**
 * 粘贴图片事件方法
 * @param e 事件参数
 */
function pasteImgHandler(e: ClipboardEvent, editor: Editor): void {
    if (_haveTextOrHtml(editor, e)) {
        // 粘贴过来的有 text 或者 html ，则不执行粘贴图片逻辑
        return
    }

    // 获取粘贴的图片列表
    const pastedFiles = getPasteImgs(e)
    if (!pastedFiles.length) {
        return
    }

    // code 中忽略（暂不管它）

    // 执行上传
    const uploadImg = new UploadImg(editor)
    uploadImg.uploadImg(pastedFiles)
}

/**
 * 粘贴图片
 * @param editor 编辑器对象
 * @param pasteEvents 粘贴事件列表
 */
function bindPasteImg(editor: Editor): void {
    // 绑定 paste 事件
    editor.txt.eventHooks.pasteEvents.push((e: ClipboardEvent) => {
        pasteImgHandler(e, editor)
    })
}

export default bindPasteImg
