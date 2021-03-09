/**
 * @description 保证table后面始终有dom
 * @author yanbiao(86driver)
 */
import Editor from '../../../editor/index'

export default function bindEventKeyboardEvent(editor: Editor) {
    const { txt, selection } = editor
    const { keydownEvents } = txt.eventHooks

    keydownEvents.push(function (e) {
        // 实时保存选区
        editor.selection.saveRange()
        const $selectionContainerElem = selection.getSelectionContainerElem()
        if ($selectionContainerElem) {
            const $topElem = $selectionContainerElem.getNodeTop(editor)
            // 获取选区所在节点的上一元素
            const $preElem = $topElem?.prev()
            // 判断该元素后面是否还存在元素
            // 如果存在则允许删除
            const $nextElem = $topElem?.getNextSibling()

            if ($preElem.length && $preElem?.getNodeName() === 'TABLE' && $nextElem.length === 0) {
                // 光标处于选区开头
                if (selection.getCursorPos() === 0) {
                    // 按下delete键阻止默认行为
                    if (e.keyCode === 8) {
                        e.preventDefault()
                    }
                }
            }
        }
    })
}
