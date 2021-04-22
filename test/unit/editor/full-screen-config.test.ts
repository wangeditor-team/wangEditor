import createEditor, { selector } from '../../helpers/create-editor'
import Editor from '../../../src/editor/index'
import $ from 'jquery'

let editor: Editor
const FULLSCREEN_MENU_CLASS_SELECTOR = '.w-e-icon-fullscreen'

describe('设置全屏', () => {
    beforeEach(() => {
        editor = createEditor(document, selector())
    })

    test('编辑器默认初始化全屏菜单', () => {
        const toolbarSelector = editor.$toolbarElem.elems[0].className
        const fullMenuEl = $(`.${toolbarSelector}`).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(1)
    })

    test('编辑器区和菜单分离的编辑器不初始化全屏菜单', () => {
        const seprateModeEditor = createEditor(document, selector(), selector())
        const toolbarSelector = seprateModeEditor.$toolbarElem.selector as string
        const fullMenuEl = $(toolbarSelector).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(0)
    })

    test('编辑器配置 showFullScreen 为false时不初始化全屏菜单', () => {
        const seprateModeEditor = createEditor(document, selector(), '', { showFullScreen: false })
        const toolbarSelector = seprateModeEditor.$toolbarElem.selector as string
        const fullMenuEl = $(toolbarSelector).find(FULLSCREEN_MENU_CLASS_SELECTOR)

        expect(fullMenuEl.length).toBe(0)
    })
})
