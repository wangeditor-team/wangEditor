/**
 * @description 查看HTML源代码
 * @author liukang
 */
import BtnMenu from '../menu-constructors/BtnMenu'
import $ from '../../utils/dom-core'
import _$ from 'jquery'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
class ToHtml extends BtnMenu implements MenuActive {
    // beautify-html库函数
    htmlBeautify: any
    constructor(editor: Editor) {
        // amd方式引入beautify-html库
        const { html_beautify } = require('../../lib/js-beautify/beautify-html.js')
        const $elem = $(
            '<div class="w-e-menu" data-title="HTML源代码"><i class="w-e-icon-html5"></i></div>'
        )
        super($elem, editor)
        this.htmlBeautify = html_beautify
    }
    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        _$('[data-we-id]').toggleClass('wangEditor-html')
        editor.isEditorHtmlMode = _$('[data-we-id]').hasClass('wangEditor-html')
        if (editor.isEditorHtmlMode) {
            const $data = editor.$textElem.elems[0].innerHTML
            editor.txt.html(this.htmlBeautify($data), 2)
            this.active()
        } else {
            this.unActive()
            const current = editor.$textElem.elems[0].innerText
            editor.txt.html(current)
        }

        // 即时更新菜单栏是否禁用状态
        this.tryChangeDisabled()
    }
    /**
     * 尝试修改除了HTML源代码其他所有菜单禁用状态
     */
    public tryChangeDisabled(): void {
        var button, i, len, ref
        const editor = this.editor
        ref = editor.menus.menuList
        for (i = 0, len = ref.length; i < len; i++) {
            button = ref[i]
            // 除了HTML源代码其他所有菜单
            if (button.key !== 'toHtml') {
                button.isDisabled(editor.isEditorHtmlMode)
            }
        }
    }
    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void { }
}
export default ToHtml
