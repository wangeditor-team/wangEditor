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
            <i class="w-e-icon-happy"></i>
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
        const editor = this.editor
        const config = editor.config
        // 获取表情配置
        const emotions = config.emotions || []

        // 创建表情 dropPanel 的配置
        const tabConfig = []
        emotions.forEach(emotData => {
            const emotType = emotData.type
            const content = emotData.content || []

            // 这一组表情最终拼接出来的 html
            let faceHtml = ''

            // emoji 表情
            if (emotType === 'emoji') {
                content.forEach(item => {
                    if (item) {
                        faceHtml += '<span class="w-e-item">' + item + '</span>'
                    }
                })
            }
            // 图片表情
            if (emotType === 'image') {
                content.forEach(item => {
                    const src = item.src
                    const alt = item.alt
                    if (src) {
                        // 加一个 data-w-e 属性，点击图片的时候不再提示编辑图片
                        faceHtml += '<span class="w-e-item"><img src="' + src + '" alt="' + alt + '" data-w-e="1"/></span>'
                    }
                })
            }

            tabConfig.push({
                title: emotData.title,
                tpl: `<div class="w-e-emoticon-container">${faceHtml}</div>`,
                events: [
                    {
                        selector: 'span.w-e-item',
                        type: 'click',
                        fn: (e) => {
                            const target = e.target
                            const $target = $(target)
                            const nodeName = $target.getNodeName()

                            let insertHtml
                            if (nodeName === 'IMG') {
                                // 插入图片
                                insertHtml = $target.parent().html()
                            } else {
                                // 插入 emoji
                                insertHtml = '<span>' + $target.html() + '</span>'
                            }

                            this._insert(insertHtml)
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        }
                    }
                ]
            })
        })

        const panel = new Panel(this, {
            width: 300,
            height: 200,
            // 一个 Panel 包含多个 tab
            tabs: tabConfig
        })

        // 显示 panel
        panel.show()

        // 记录属性
        this.panel = panel
    },

    // 插入表情
    _insert: function (emotHtml) {
        const editor = this.editor
        editor.cmd.do('insertHTML', emotHtml)
    }
}

export default Emoticon