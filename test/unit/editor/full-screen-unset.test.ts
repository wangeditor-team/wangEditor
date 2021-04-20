import createEditor, { selector } from '../../helpers/create-editor'
import { setFullScreen, setUnFullScreen } from '../../../src/editor/init-fns/set-full-screen'
import $ from 'jquery'

const EDIT_CONTAINER_FULLSCREEN_CLASS = 'w-e-full-screen-editor'

test.only('调用 setUnFullScreen 取消编辑器全屏模式', () => {
    const editor = createEditor(document, selector())

    setFullScreen(editor)

    setUnFullScreen(editor)

    const toolbarSelector = editor.$toolbarElem.elems[0].className
    const $iconElem = $(`.${toolbarSelector}`).children().last().find('i')
    const $editorParent = $(`.${toolbarSelector}`).parent().get(0)
    const $textContainerElem = editor.$textContainerElem

    expect($iconElem.get(0).className).toContain('w-e-icon-fullscreen')
    expect($editorParent.className).not.toContain(EDIT_CONTAINER_FULLSCREEN_CLASS)
    expect($editorParent.style.zIndex).toBe('auto')
    expect($textContainerElem.elems[0].style.height).toBe(editor.config.height + 'px')
})
