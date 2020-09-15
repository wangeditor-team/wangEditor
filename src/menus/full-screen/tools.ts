/**
 * @description 实现打开全屏和关闭全屏的功能
 * @author xiaokyo
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor/index'

const iconFullScreenText = 'w-e-icon-fullscreen' // 全屏icon class
const iconExitFullScreenText = 'w-e-icon-fullscreen_exit' // 退出全屏icon class
const classfullScreenEditor = 'w-e-full-screen-editor' // 全屏添加至编辑器的class

/**
 * 设置全屏
 * @param editor 编辑器实例
 */
export const setFullScreen = (editor: Editor) => {
    const $editorParent = $(editor.toolbarSelector)
    const $textContainerElem = editor.$textContainerElem
    const FullScreen = editor.menus.menuFind('fullScreen')
    const $iconElem = FullScreen.$elem.find(`i`)
    const config = editor.config

    $iconElem.removeClass(iconFullScreenText)
    $iconElem.addClass(iconExitFullScreenText)
    $editorParent.addClass(classfullScreenEditor)
    $editorParent.css('z-index', config.zIndexFullScreen)
    $textContainerElem.css('height', '100%')
    if (FullScreen) FullScreen.active()
}

/**
 * 取消全屏
 * @param editor 编辑器实例
 */
export const setUnFullScreen = (editor: Editor) => {
    const $editorParent = $(editor.toolbarSelector)
    const $textContainerElem = editor.$textContainerElem
    const FullScreen = editor.menus.menuFind('fullScreen')
    const $iconElem = FullScreen.$elem.find(`i`)
    const config = editor.config

    $iconElem.removeClass(iconExitFullScreenText)
    $iconElem.addClass(iconFullScreenText)
    $editorParent.removeClass(classfullScreenEditor)
    $editorParent.css('z-index', 'auto')
    $textContainerElem.css('height', config.height + 'px')
    if (FullScreen) FullScreen.unActive()
}
