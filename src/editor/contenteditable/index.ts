/**
 * @description contenteditable 内容编辑
 * @author lichunlin
 */
import Editor from '../index'
import $ from '../../utils/dom-core'
import '../../assets/style/contenteditable.less'
import ZIndex from '../z-index'

const zindex = new ZIndex()
let isCurtain = false // 避免重复生成幕布

// 创建幕布
function createCurtain(editor: Editor) {
    if (!isCurtain) {
        zindex.init(editor)
        // 隐藏编辑区域
        editor.$textElem.hide()
        // 生成div 渲染编辑内容
        let menuZindexValue = zindex.get('menu')
        const content = editor.txt.html()
        const $contentDom = $(
            `<div class="w-e-content-edit-able" style="z-index:${menuZindexValue}">
                <div class="w-e-content-preview w-e-text">${content}</div>
            </div>`
        )
        editor.$textContainerElem.append($contentDom)
        // 生成div 菜单膜布
        let textContainerZindexValue = zindex.get('textContainer')
        const $menuDom = $(
            `<div class="w-e-menue-edit-able" style="z-index:${textContainerZindexValue}"></div>`
        )
        editor.$toolbarElem.append($menuDom)
        isCurtain = true
        return
    }
    console.log('已创建')
}

// 销毁幕布并显示可编辑区域
function deleteCurtain(editor: Editor) {
    const $contentDom = editor.$textContainerElem.find('.w-e-content-edit-able')
    $contentDom.remove()
    const $menuDom = editor.$toolbarElem.find('.w-e-menue-edit-able')
    $menuDom.remove()
    editor.$textElem.show()
    isCurtain = false
}

export default {
    createCurtain,
    deleteCurtain,
}
