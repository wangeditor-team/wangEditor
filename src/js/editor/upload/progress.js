/*
    上传进度条
*/

import $ from '../../util/dom-core.js'

function Progress(editor) {
    this.editor = editor
    this._time = 0
    this._isShow = false
    this._isRender = false
    this._timeoutId = 0
    this.$textContainer = editor.$textContainerElem
    this.$bar = $('<div class="w-e-progress"></div>')
}

Progress.prototype = {
    constructor: Progress,

    show: function (progress) {
        // 状态处理
        if (this._isShow) {
            return
        }
        this._isShow = true

        // 渲染
        const $bar = this.$bar
        if (!this._isRender) {
            const $textContainer = this.$textContainer
            $textContainer.append($bar)
        } else {
            this._isRender = true
        }

        // 改变进度（节流，100ms 渲染一次）
        if (Date.now() - this._time > 100) {
            if (progress <= 1) {
                $bar.css('width', progress * 100 + '%')
                this._time = Date.now()
            }
        }

        // 隐藏
        let timeoutId = this._timeoutId
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            this._hide()
        }, 500)
    },

    _hide: function () {
        const $bar = this.$bar
        $bar.remove()

        // 修改状态
        this._time = 0
        this._isShow = false
        this._isRender = false
    }
}

export default Progress
