/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $, { DomElement } from '../../utils/dom-core'
import Panel from '../menu-constructors/Panel'
import Editor from '../../editor/index'
import PanelMenu from '../menu-constructors/PanelMenu'
import { MenuActive } from '../menu-constructors/Menu'
import isActive from './is-active'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
// const highlightedCode = hljs.highlightAuto('<span>Hello World!</span>').value

class Code extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-terminal"></i>
            </div>`
        )

        super($elem, editor)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        editor.cmd.do('foreColor', value)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $videoElem

        // 弹出 panel
        // @ts-ignore
        this.createPanel('', Editor)
    }

    /**
     * 创建 panel
     * @param link 链接
     */
    private createPanel(iframe: string): void {
        const editor = this.editor
        // panel 中需要用到的id
        const inputIFrameId = getRandom('input-iframe')
        const languageId = getRandom('select')
        const btnOkId = getRandom('btn-ok')

        const tpl = `<div>
            <select name="" id="${languageId}">
                ${editor.config.languageType.map(language => {
                    return '<option value ="' + language + '">' + language + '</option>'
                })}
            </select>
            <br><br>
            <textarea id="${inputIFrameId}" type="text" class="block" placeholder="" style="height: 200px"/></textarea>
            <div class="w-e-button-container">
                <button id="${btnOkId}" class="right">插入</button>
            </div>
        </div>`

        if (isActive(editor)) {
            tpl = `<div>
                <select name="" id="${languageId}">
                    ${editor.config.languageType.map(language => {
                        return '<option value ="' + language + '">' + language + '</option>'
                    })}
                </select>
                <br><br>
                <textarea id="${inputIFrameId}" type="text" class="block" placeholder="" style="height: 200px"/></textarea>
                <div class="w-e-button-container">
                    <button id="${btnOkId}" class="right">插入</button>
                </div>
            </div>`
        }

        //创建panel
        const panel = new Panel(this, {
            width: 400,
            height: 300,
            tabs: [
                {
                    title: '插入代码',
                    // 模板
                    tpl: tpl,
                    // 事件绑定
                    events: [
                        // 插入视频
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
                                    code =
                                        '<pre><code class="' +
                                        languageType +
                                        '">' +
                                        hljs.highlightAuto($code.val()).value +
                                        '</code></pre>'
                                } catch (e) {
                                    code =
                                        '<pre><code class="' +
                                        languageType +
                                        '">' +
                                        $code.val() +
                                        '</code></pre>'
                                }

                                // 代码为空，则不插入
                                if (!code) return

                                console.log(code)

                                this.insertCode(code)

                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            },
                        },
                    ],
                },
            ],
        })
        panel.create()
        this.setPanel(panel)
    }

    /**
     * 插入代码code
     * @param iframe html标签
     */
    public insertCode(code: string): void {
        const editor = this.editor
        editor.cmd.do('insertHTML', code + '<p><br></p>')
    }

    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() {
        const editor = this.editor
        if (isActive(editor)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Code
