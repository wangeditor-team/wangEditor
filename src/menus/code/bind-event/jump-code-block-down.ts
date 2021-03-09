/**
 * @description 代码块为最后一块内容时往下跳出代码块
 * @author zhengwenjian
 */
import Editor from '../../../editor/index'
import $ from '../../../utils/dom-core'

/**
 * 在代码块最后一行 按方向下键跳出代码块的处理
 * @param editor 编辑器实例
 */
export default function bindEventJumpCodeBlock(editor: Editor) {
    const { $textElem, selection, txt } = editor
    const { keydownEvents } = txt.eventHooks

    keydownEvents.push(function (e) {
        // 40 是键盘中的下方向键
        if (e.keyCode !== 40) return
        const node = selection.getSelectionContainerElem()
        const $lastNode = $textElem.children()?.last()
        if (node?.elems[0].tagName === 'XMP' && $lastNode?.elems[0].tagName === 'PRE') {
            // 就是最后一块是代码块的情况插入空p标签并光标移至p
            const $emptyP = $('<p><br></p>')
            $textElem.append($emptyP)
        }
    })
    // fix: 始终保留code区域后面的空行，防止发生代码块作为最后一行无法输入的问题
    keydownEvents.push(function (e) {
        // 实时保存选区
        editor.selection.saveRange()
        // 获取当前选区的节点
        const $selectionContainerElem = selection.getSelectionContainerElem()
        if ($selectionContainerElem) {
            // 获取当前选区节点的最外层元素
            const $topElem = $selectionContainerElem.getNodeTop(editor)
            // 获取当前选区节点的上一个元素
            // 用来判断是否为pre标签
            const $preElem = $topElem.length
                ? $topElem.prev().length
                    ? $topElem.prev()
                    : null
                : null
            // 上一个元素存在，并且是pre标签，阻止删除的默认键盘事件
            if ($preElem && $preElem.getNodeName() === 'PRE') {
                // 光标处于选区开头（允许用户删除当前节点中已经存在的文字)
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
