/**
 * @description code 菜单 panel tab 配置
 * @author lkw
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $, { DomElement } from '../../utils/dom-core'
import isActive from './is-active'
import hljs from 'highlight.js'
// import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/styles/default.css'

export default function (editor: editor, text: string, link: string): PanelConf {
    // panel 中需要用到的id
    const inputIFrameId = getRandom('input-iframe')
    const languageId = getRandom('select')
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

        const $linkElem = editor.selection.getSelectionTopContainerElem('CODE')
        if (!$linkElem) return
        console.log($linkElem)
        editor.selection.createRangeByElem($linkElem)
        editor.selection.restoreSelection()
        $selectedLink = $linkElem // 赋值给函数内全局变量
    }

    /**
     * 插入链接
     * @param text 文字
     * @param link 链接
     */
    function insertCode(text: string, link: string): void {
        // 选区处于链接中，则选中整个菜单，再执行 insertHTML
        if (isActive(editor)) {
            selectLinkElem()
        }

        // editor.cmd.do('insertHTML', `<a href="${link}" target="_blank">${text}</a>`)

        editor.cmd.do('insertHTML', text)
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
        width: 400,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: '插入代码',
                // 模板
                tpl: `<div>
                        <select name="" id="${languageId}">
                            ${editor.config.languageType.map(language => {
                                return '<option value ="' + language + '">' + language + '</option>'
                            })}
                        </select>
                        <br><br>
                        <textarea value="" id="${inputIFrameId}" type="text" class="block" placeholder="" style="height: 200px">${text}</textarea>
                        <div class="w-e-button-container">
                            <button id="${btnOkId}" class="right">${
                    isActive(editor) ? '修改' : '插入'
                }</button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    // 插入链接
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            let code
                            // 执行插入视频
                            const $code = $('#' + inputIFrameId)
                            const $select = $('#' + languageId)

                            let languageType = $select.val()

                            try {
                                code = hljs.highlightAuto($code.val()).value
                            } catch (e) {
                                code = $code.val()
                            }

                            // 代码为空，则不插入
                            if (!code) return

                            //增加标签
                            if (!isActive(editor)) {
                                //增加pre标签
                                code = `<pre><code class="${languageType}">${code}</code></pre>`

                                //增加换行符 隔离代码块
                                code += '<p><br></p>'
                            }

                            insertCode(code)

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
