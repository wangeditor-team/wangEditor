/**
 * @author 翠林
 * @deprecated 拖拽绑定
 */

import { throttle } from '../../../utils/util'
import $, { DomElement } from './../../../utils/dom-core'

/**
 * 滑块的定位信息（相对于父容器）
 */
export interface position {
    x: number
    y: number
    /** x 的最大值 */
    w: number
    /** y 的最大值 */
    h: number
}

/**
 * 滑块变化被拖动的回调函数
 */
export type dragcall = (position: position) => void

/**
 * 绑定滑块的拖拽
 * @param sliding 滑块的 DomElement 实例
 * @param dragcall 拖拽回调，将鼠标当前位置距离滑块父容器左上角的 x/y 轴值传入回调
 */
export default function drag(sliding: DomElement, dragcall: dragcall) {
    // 滑块的父容器
    const parent = sliding.parent()

    parent.on('mousedown', function (e: MouseEvent) {
        const { width, height, left, top } = parent.getBoundingClientRect()

        // 直接点击在容器上才执行
        if (e.target != sliding.elems[0]) {
            dragcall.call(e.target, { x: e.offsetX, y: e.offsetY, w: width, h: height })
        }

        // 鼠标移动回调
        const mousemove = throttle(function (e: MouseEvent) {
            // 最大宽高
            let x = e.clientX - left
            let y = e.clientY - top
            x = x < 0 ? 0 : x >= width ? width : x
            y = y < 0 ? 0 : y >= height ? height : y
            dragcall.call(e.target, { x, y, w: width, h: height })
        }, 50)

        const $document = $(document)

        // 鼠标弹起回调
        function mouseup() {
            $document.off('mousemove', mousemove)
            $document.off('mouseup', mouseup)
        }

        $document.on('mousemove', mousemove)
        $document.on('mouseup', mouseup)
    })
}
