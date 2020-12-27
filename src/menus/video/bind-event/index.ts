/**
 * @description 绑定视频的事件
 * @author lichunlin
 */

import Editor from '../../../editor/index'
import bindTooltipVideo from './tooltip-event'

/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor: Editor): void {
    //Tooltip
    bindTooltipVideo(editor)
}

export default bindEvent
