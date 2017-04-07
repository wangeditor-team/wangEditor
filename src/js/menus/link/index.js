/*
    menu - link
*/
import $ from '../../util/dom-core.js'
import { getRandom } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Link(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"><i/></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Link.prototype = {
    constructor: Link,

    // 点击事件
    onClick: function (e) {
        // panel 中需要用到的id
        const inputLinkId = getRandom('input-link')
        const inputTextId = getRandom('input-text')
        const btnOkId = getRandom('btn-ok')
        const btnDelId = getRandom('btn-del')

        // 初始化并显示 panel
        const panel = new Panel(this, {
            width: 300,
            height: 150,
            // panel 中可包含多个 tab
            tabs: [
                {
                    // tab 的标题
                    title: '链接',
                    // 模板
                    tpl: `<div>
                            <table>
                                <tr>
                                    <td>文字</td>
                                    <td><input id="${inputTextId}" type="text"/></td>
                                </tr>
                                <tr>
                                    <td>链接</td>
                                    <td><input id="${inputLinkId}" type="text"/></td>
                                </tr>
                            </table>
                            <div>
                                <button id="${btnOkId}">插入</button>
                                <button id="${btnDelId}">删除链接</button>
                            </div>
                        </div>`,
                    // 事件绑定
                    evnts: [
                        // 插入链接
                        {
                            selector: btnOkId,
                            type: 'click',
                            fn: (e) => {

                            }
                        },
                        // 删除链接
                        {
                            selector: btnDelId,
                            type: 'click',
                            fn: (e) => {

                            }
                        }
                    ]
                }, // tab end
                {
                    title: 'test',
                    tpl: `<div>test</div>`
                }
            ] // tabs end
        })

        // 显示 panel
        panel.show()
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if ($selectionELem.getNodeName() === 'A') {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Link