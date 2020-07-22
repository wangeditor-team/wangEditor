/**
 * @description 绑定图片的事件
 * @author wangfupeng
 */

import Editor from '../../../editor/index'
import bindPasteImg from './paste-img'

/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor: Editor): void {
    // 粘贴图片
    bindPasteImg(editor)

    // 可再扩展其他事件...如图片 tooltip 等
}

export default bindEvent
