/**
 * @description link 菜单 panel tab 配置
 * @author wangfupeng
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $, { DomElement } from '../../utils/dom-core'
import isActive from './is-active'

export default function (editor: editor, text: string, link: string): PanelConf {
    // panel 中需要用到的id
    const inputLinkId = getRandom('input-link')
    const inputTextId = getRandom('input-text')
    const btnOkId = getRandom('btn-ok')
    const btnDelId = getRandom('btn-del')

    // 是否显示“删除链接”
    const delBtnDisplay = isActive(editor) ? 'inline-block' : 'none'

    let $selectedLink: DomElement

    /**
     * 选中整个链接元素
     */
    function selectLinkElem(): void {
        if (!isActive(editor)) return

        const $linkElem = editor.selection.getSelectionContainerElem()
        if (!$linkElem) return
        editor.selection.createRangeByElem($linkElem)
        editor.selection.restoreSelection()

        $selectedLink = $linkElem // 赋值给函数内全局变量
    }

    /**
     * 插入链接
     * @param text 文字
     * @param link 链接
     */
    function insertLink(text: string, link: string): void {
        if (isActive(editor)) {
            // 选区处于链接中，则选中整个菜单，再执行 insertHTML
            selectLinkElem()
            editor.cmd.do('insertHTML', `<a href="${link}" target="_blank">${text}</a>`)
        } else {
            // 选区未处于链接中，直接插入即可
            editor.cmd.do('insertHTML', `<a href="${link}" target="_blank">${text}</a>`)
        }
    }

    /**
     * 删除链接
     */
    function delLink(): void {
        if (!isActive(editor)) {
            return
        }
        // 选中整个链接
        selectLinkElem()
        // 用文本替换链接
        const selectionText = $selectedLink.text()
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>')
    }

    const conf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: '链接',
                // 模板
                tpl: `<div>
                        <input id="${inputTextId}" type="text" class="block" value="${text}" placeholder="链接文字"/></td>
                        <input id="${inputLinkId}" type="text" class="block" value="${link}" placeholder="如 https://..."/></td>
                        <div class="w-e-button-container">
                            <button id="${btnOkId}" class="right">插入</button>
                            <button id="${btnDelId}" class="gray right" style="display:${delBtnDisplay}">删除链接</button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    // 插入链接
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            // 执行插入链接
                            const $link = $('#' + inputLinkId)
                            const $text = $('#' + inputTextId)
                            let link = $link.val().trim()
                            let text = $text.val().trim()

                            // 链接为空，则不插入
                            if (!link) return
                            // 文本为空，则用链接代替
                            if (!text) text = link

                            insertLink(text, link)

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                    // 删除链接
                    {
                        selector: '#' + btnDelId,
                        type: 'click',
                        fn: () => {
                            // 执行删除链接
                            delLink()

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                ],
            }, // tab end
        ], // tabs end
    }

    return conf
}
