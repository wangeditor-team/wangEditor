/**
 * @description 拖拽上传图片
 * @author wangfupeng
 */

import Editor from '../../../editor/index'
import UploadImg from '../upload-img'

let _editor: Editor

/**
 * 拖拽图片的事件
 * @param e 事件参数
 */
function dropImgHandler(e: any): void {
    const files = e.dataTransfer && e.dataTransfer.files
    if (!files || !files.length) {
        return
    }

    // 上传图片
    const uploadImg = new UploadImg(_editor)
    uploadImg.uploadImg(files)
}

function bindDropImg(editor: Editor): void {
    _editor = editor

    // 绑定 drop 事件
    editor.txt.eventHooks.dropEvents.push(dropImgHandler)
}

export default bindDropImg
