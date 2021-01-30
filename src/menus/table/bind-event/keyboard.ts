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
            const $preElem = $topElem.length
                ? $topElem.prev().length
                    ? $topElem.prev()
                    : null
                : null
            if ($preElem && $preElem.getNodeName() === 'TABLE') {
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
