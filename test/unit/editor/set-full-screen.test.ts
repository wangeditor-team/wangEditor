import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor/index'
import { setFullScreen, setUnFullScreen } from '../../../src/editor/init-fns/set-full-screen'
import $ from 'jquery'

let editor: Editor
const FULLSCREEN_MENU_CLASS_SELECTOR = '.w-e-icon-fullscreen'
const EDIT_CONTAINER_FULLSCREEN_CLASS = 'w-e-full-screen-editor'

describe('设置全屏', () => {
    beforeEach(() => {
        editor = createEditor(document, 'div1')
    })

    test('编辑器默认初始化全屏菜单', () => {
        const toolbarSelector = editor.$toolbarElem.elems[0].className
        const fullMenuEl = $(`.${toolbarSelector}`).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(1)
    })

    test('编辑器区和菜单分离的编辑器不初始化全屏菜单', () => {
        const seprateModeEditor = createEditor(document, 'div1', 'div2')
        const toolbarSelector = seprateModeEditor.$toolbarElem.selector as string
        const fullMenuEl = $(toolbarSelector).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(0)
    })

    test('编辑器配置 showFullScreen 为false时不初始化全屏菜单', () => {
        const seprateModeEditor = createEditor(document, 'div1', '', { showFullScreen: false })
        const toolbarSelector = seprateModeEditor.$toolbarElem.selector as string
        const fullMenuEl = $(toolbarSelector).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(0)
    })

    test('调用 setFullScreen 设置编辑器全屏模式', () => {
        setFullScreen(editor)

        const toolbarSelector = editor.$toolbarElem.elems[0].className
        const $iconElem = $(`.${toolbarSelector}`).children().last().find('i')
        const $editorParent = $(`.${toolbarSelector}`).parent().get(0)
        const $textContainerElem = editor.$textContainerElem

        expect($iconElem.get(0).className).toContain('w-e-icon-fullscreen_exit')
        expect($editorParent.className).toContain(EDIT_CONTAINER_FULLSCREEN_CLASS)
        expect(+$editorParent.style.zIndex).toEqual(editor.config.zIndexFullScreen)
        const bar = editor.$toolbarElem.getBoundingClientRect()
        expect($textContainerElem.elems[0].style.height).toBe(`calc(100% - ${bar.height}px)`)
    })

    test('调用 setUnFullScreen 取消编辑器全屏模式', () => {
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
})
