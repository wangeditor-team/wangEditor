/**
 * @description link 菜单 panel tab 配置
 * @author wangfupeng
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import isActive from './is-active'

export default function (editor: editor, text: string, link: string): PanelConf {
    // panel 中需要用到的id
    const inputLinkId = getRandom('input-link')
    const inputTextId = getRandom('input-text')
    const btnOkId = getRandom('btn-ok')
    const btnDelId = getRandom('btn-del')

    // 是否显示“删除链接”
    const delBtnDisplay = isActive(editor) ? 'inline-block' : 'none'

    /**
     * 插入链接
     * @param text 文字
     * @param link 链接
     */
    function insertLink(text: string, link: string): void {
        editor.cmd.do('insertHTML', `<a href="${link}" target="_blank">${text}</a>`)
    }

    /**
     * 删除链接
     */
    function delLink(): void {
        if (!isActive(editor)) {
            return
        }
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const selectionText = editor.selection.getSelectionText()
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
                            const link = $link.val()
                            const text = $text.val()
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
