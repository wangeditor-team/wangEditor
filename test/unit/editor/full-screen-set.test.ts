import createEditor, { selector } from '../../helpers/create-editor'
import { setFullScreen } from '../../../src/editor/init-fns/set-full-screen'
import $ from 'jquery'

const EDIT_CONTAINER_FULLSCREEN_CLASS = 'w-e-full-screen-editor'

test('调用 setFullScreen 设置编辑器全屏模式', () => {
    const editor = createEditor(document, selector())

    setFullScreen(editor)

    const toolbarSelector = editor.$toolbarElem.elems[0].className
    const $iconElem = $(`.${toolbarSelector}`).children().last().find('i')
    const $editorParent = $(`.${toolbarSelector}`).parent().get(0)
    const $textContainerElem = editor.$textContainerElem

    expect($iconElem.get(0).className).toContain('w-e-icon-fullscreen_exit')
    console.log($editorParent.className)
    expect($editorParent.className).toContain(EDIT_CONTAINER_FULLSCREEN_CLASS)
    expect(+$editorParent.style.zIndex).toEqual(editor.config.zIndexFullScreen)
    const bar = editor.$toolbarElem.getBoundingClientRect()
    expect($textContainerElem.elems[0].style.height).toBe(`calc(100% - ${bar.height}px)`)
})
