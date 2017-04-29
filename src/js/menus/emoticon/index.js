/*
    menu - emoticon
*/
import $ from '../../util/dom-core.js'
import Panel from '../panel.js'

// 构造函数
function Emoticon(editor) {
    this.editor = editor
    this.$elem = $(
        `<div class="w-e-menu">
            <i class="w-e-icon-happy"><i/>
        </div>`
    )
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Emoticon.prototype = {
    constructor: Emoticon,

    onClick: function () {
        this._createPanel()
    },

    _createPanel: function () {
        // 拼接表情字符串
        let faceHtml = ''
        const faceStr = '😀 😃 😄 😁 😆 😅 😂  😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁  😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐'
        faceStr.split(/\s/).forEach(item => {
            if (item) {
                faceHtml += '<span class="w-e-item">' + item + '</span>'
            }
        })

        let handHtml = ''
        const handStr = '🙌 👏 👋 👍 👎 👊 ✊ ️👌 ✋ 👐 💪 🙏 ️👆 👇 👈 👉 🖕 🖐 🤘 🖖'
        handStr.split(/\s/).forEach(item => {
            if (item) {
                handHtml += '<span class="w-e-item">' + item + '</span>'
            }
        })

        const panel = new Panel(this, {
            width: 300,
            height: 200,
            // 一个 Panel 包含多个 tab
            tabs: [
                {
                    // 标题
                    title: '表情',
                    // 模板
                    tpl: `<div class="w-e-emoticon-container">${faceHtml}</div>`,
                    // 事件绑定
                    events: [
                        {
                            selector: 'span.w-e-item',
                            type: 'click',
                            fn: (e) => {
                                const target = e.target
                                this._insert(target.innerHTML)
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        }
                    ]
                }, // first tab end
                {
                    // 标题
                    title: '手势',
                    // 模板
                    tpl: `<div class="w-e-emoticon-container">${handHtml}</div>`,
                    // 事件绑定
                    events: [
                        {
                            selector: 'span.w-e-item',
                            type: 'click',
                            fn: (e) => {
                                const target = e.target
                                this._insert(target.innerHTML)
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        }
                    ]
                } // second tab end
            ] // tabs end
        })

        // 显示 panel
        panel.show()

        // 记录属性
        this.panel = panel
    },

    // 插入表情
    _insert: function (emoji) {
        const editor = this.editor
        editor.cmd.do('insertHTML', '<span>' + emoji + '</span>')
    }
}

export default Emoticon