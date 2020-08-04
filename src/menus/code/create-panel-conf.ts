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
// import 'highlight.js/styles/default.css'

export default function (editor: editor, text: string, code: string): PanelConf {
    // panel 中需要用到的id
    const codeId = getRandom('textarea-code')
    const languageId = getRandom('select-language')
    const inputCodeId = getRandom('input-code')
    const inputTextId = getRandom('input-text')
    const btnOkId = getRandom('btn-ok')
    const btnDelId = getRandom('btn-del')

    // 是否显示“删除代码”
    const delBtnDisplay = isActive(editor) ? 'inline-block' : 'none'

    let $selectedCode: DomElement

    /**
     * 选中整个代码元素
     */
    function selectCodeElem(): void {
        if (!isActive(editor)) return

        const $codeElem = editor.selection.getSelectionTopContainerElem('CODE')
        if (!$codeElem) return
        console.log($codeElem)
        editor.selection.createRangeByElem($codeElem)
        editor.selection.restoreSelection()
        $selectedCode = $codeElem // 赋值给函数内全局变量
    }

    /**
     * 插入代码
     * @param text 文字
     * @param code 代码
     */
    function insertCode(text: string, code: string): void {
        // 选区处于代码中，则选中整个菜单，再执行 insertHTML
        if (isActive(editor)) {
            selectCodeElem()
        }

        // editor.cmd.do('insertHTML', `<a href="${code}" target="_blank">${text}</a>`)

        editor.cmd.do('insertHTML', text)
    }

    /**
     * 删除代码
     */
    function delCode(): void {
        if (!isActive(editor)) {
            return
        }
        // 选中整个代码
        selectCodeElem()
        // 用文本替换代码
        const selectionText = $selectedCode.text()
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
                        <textarea value="" id="${codeId}" type="text" class="block" placeholder="" style="height: 200px">${text}</textarea>
                        <div class="w-e-button-container">
                            <button id="${btnOkId}" class="right">${
                    isActive(editor) ? '修改' : '插入'
                }</button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    // 插入代码
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            let code
                            // 执行插入视频
                            const $code = $('#' + codeId)
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

                            // @ts-ignore
                            insertCode(code)

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                    // 删除代码
                    {
                        selector: '#' + btnDelId,
                        type: 'click',
                        fn: () => {
                            // 执行删除代码
                            delCode()

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
