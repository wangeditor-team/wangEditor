/**
 * @description 绑定编辑器事件 change blur focus
 * @author wangfupeng
 */

import Editor from '../index'
import { debounce } from '../../utils/util'
import $ from '../../utils/dom-core'

// 记录当前的 html
let CURRENT_HTML = ''

function bindEvent(editor: Editor): void {
    // 绑定 change 事件
    _bindChange(editor)

    // 绑定 focus blur 事件
    _bindFocusAndBlur(editor)
}

/**
 * 绑定 change 事件
 * @param editor 编辑器实例
 */
function _bindChange(editor: Editor): void {
    // 记录当前内容
    CURRENT_HTML = editor.txt.html() || ''

    // 获取必要的 dom 节点
    const $textContainerElem = editor.$textContainerElem
    const $toolbarElem = editor.$toolbarElem

    // 记录输入法的开始和结束
    let compositionEnd = true
    // 输入法开始输入
    $textContainerElem.on('compositionstart', () => (compositionEnd = false))
    // 输入法结束输入
    $textContainerElem.on('compositionend', () => (compositionEnd = true))

    // 绑定 onchange
    const onchangeTimeout = editor.config.onchangeTimeout
    const change = debounce(changeHandler, onchangeTimeout)
    $textContainerElem.on('click keyup', () => {
        // 输入法结束才出发 onchange
        compositionEnd && change(editor)
    })
    $toolbarElem.on('click', () => {
        change(editor)
    })
}

/**
 * 绑定 focus blur 事件
 * @param editor 编辑器实例
 */
function _bindFocusAndBlur(editor: Editor): void {
    // 当前编辑器是否是焦点状态
    editor.isFocus = false

    $(document).on('click', (e: Event) => {
        const target = e.target
        const $target = $(target)
        const $textElem = editor.$textElem
        const $toolbarElem = editor.$toolbarElem

        //判断当前点击元素是否在编辑器内
        const isChild = $textElem.isContain($target)

        //判断当前点击元素是否为工具栏
        const isToolbar = $toolbarElem.isContain($target)
        const isMenu = $toolbarElem.elems[0] == e.target ? true : false

        if (!isChild) {
            // 若为选择工具栏中的功能，则不视为成 blur 操作
            if (isToolbar && !isMenu) {
                return
            }

            if (editor.isFocus) {
                _blurHandler(editor)
            }
            editor.isFocus = false
        } else {
            if (!editor.isFocus) {
                _focusHandler(editor)
            }
            editor.isFocus = true
        }
    })
}

/**
 * change 事件
 * @param editor 编辑器实例
 */
export function changeHandler(editor: Editor): void {
    const config = editor.config
    const onchange = config.onchange

    // 判断内容是否有变化
    let html = editor.txt.html() || ''
    // 先比较前后内容的长度
    if (html.length === CURRENT_HTML.length) {
        // 再比较每一个字符
        if (html === CURRENT_HTML) {
            // 没有变化，则返回
            return
        }
    }

    // 执行 change 事件
    onchange(html)

    // 重新赋值
    CURRENT_HTML = html
}

/**
 * blur 事件
 * @param editor 编辑器实例
 */
function _blurHandler(editor: Editor) {
    const config = editor.config
    const onblur = config.onblur
    const currentHtml = editor.txt.html() || ''
    onblur(currentHtml)
}

/**
 * focus 事件
 * @param editor 编辑器实例
 */
function _focusHandler(editor: Editor) {
    const config = editor.config
    const onfocus = config.onfocus
    const currentHtml = editor.txt.html() || ''
    onfocus(currentHtml)
}

export default bindEvent
