/**
 * @description Text 事件钩子函数。Text 公共的，不是某个菜单独有的
 * @wangfupeng
 */

import Text from '../index'
import enterToCreateP from './enter-to-create-p'
import deleteToKeepP from './del-to-keep-p'
import tabToSpan from './tab-to-space'
import pasteTextHtml from './paste-text-html'

/**
 * 初始化 text 事件钩子函数
 * @param text text 实例
 */
function initTextHooks(text: Text): void {
    const editor = text.editor
    const eventHooks = text.eventHooks

    // 回车时，保证生成的是 <p> 标签
    enterToCreateP(editor, eventHooks.enterUpEvents)

    // 删除时，保留 <p><br></p>
    deleteToKeepP(editor, eventHooks.deleteUpEvents, eventHooks.deleteDownEvents)

    // tab 转换为空格
    tabToSpan(editor, eventHooks.tabDownEvents)

    // 粘贴 text html
    pasteTextHtml(editor, eventHooks.pasteEvents)
}

export default initTextHooks
