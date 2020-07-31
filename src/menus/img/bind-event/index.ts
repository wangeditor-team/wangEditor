/**
 * @description 绑定图片的事件
 * @author wangfupeng
 */

import Editor from '../../../editor/index'
import bindPasteImg from './paste-img'
import bindDropImg from './drop-img'
import bindDragImgSize from './drag-size'

/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor: Editor): void {
    // 粘贴图片
    bindPasteImg(editor)

    // 拖拽图片
    bindDropImg(editor)

    // 可再扩展其他事件...如图片 tooltip 等
    // 拖拽图片尺寸
    bindDragImgSize(editor)
}

export default bindEvent
