/**
 * @description menu position helpers
 * @author wangfupeng
 */

import { Node, Element } from 'slate'
import { Dom7Array, getFirstVoidChild } from '../../utils/dom'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import { NODE_TO_ELEMENT } from '../../utils/weak-maps'
import { IPositionStyle } from '../interface'
import { promiseResolveThen } from '../../utils/util'

/**
 * 获取 textContainer 尺寸和定位
 * @param editor editor
 */
export function getTextContainerRect(editor: IDomEditor): {
  top: number
  left: number
  width: number
  height: number
} | null {
  const textarea = DomEditor.getTextarea(editor)

  // 获取 textareaContainer
  const $textareaContainer = textarea.$textAreaContainer
  const width = $textareaContainer.width()
  const height = $textareaContainer.height()
  const { top, left } = $textareaContainer.offset()

  return { top, left, width, height }
}

/**
 * 根据选区，计算定位（用于 modal hoverbar）
 * @param editor editor
 */
export function getPositionBySelection(editor: IDomEditor): Partial<IPositionStyle> {
  // 默认情况下 { top: 0, left: 0 }
  const defaultStyle = { top: '0', left: '0' }

  const { selection } = editor
  if (selection == null) return defaultStyle // 默认 position

  // 获取 textContainer rect
  const containerRect = getTextContainerRect(editor)
  if (containerRect == null) return defaultStyle // 默认 position
  const {
    top: containerTop,
    left: containerLeft,
    width: containerWidth,
    height: containerHeight,
  } = containerRect

  // 获取当前选区的 rect
  const range = DomEditor.toDOMRange(editor, selection)
  const rangeRect = range.getClientRects()[0]
  if (rangeRect == null) return defaultStyle // 默认 position
  const { width: rangeWidth, height: rangeHeight, top: rangeTop, left: rangeLeft } = rangeRect

  // 存储计算结构
  const positionStyle: Partial<IPositionStyle> = {}

  // 获取 选区 top left 和 container top left 的差值（< 0 则使用 0）
  let relativeTop = rangeTop - containerTop
  let relativeLeft = rangeLeft - containerLeft

  // 判断水平位置： modal/bar 显示在选区左侧，还是右侧？
  if (relativeLeft > containerWidth / 2) {
    // 选区 left 大于 containerWidth/2 （选区在 container 的右侧），则 modal/bar 显示在选区左侧
    let r = containerWidth - relativeLeft
    positionStyle.right = `${r + 5}px` // 5px 间隔
  } else {
    // 否则（选区在 container 的左侧），modal/bar 显示在选区右侧
    positionStyle.left = `${relativeLeft + 5}px` // 5px 间隔
  }

  // 判断垂直的位置： modal/bar 显示在选区上面，还是下面？
  if (relativeTop > containerHeight / 2) {
    // 选区 top  > containerHeight/2 （选区在 container 的下半部分），则 modal/bar 显示在选区的上面
    let b = containerHeight - relativeTop
    positionStyle.bottom = `${b + 5}px` // 5px 间隔
  } else {
    // 否则（选区在 container 的上半部分），则 modal/bar 显示在选区的下面
    let t = relativeTop + rangeHeight
    if (t < 0) t = 0
    positionStyle.top = `${t + 5}px` // 5px 间隔
  }

  return positionStyle
}

/**
 * 根据 node ，计算定位（用于 modal hoverbar）
 * @param editor editor
 * @param node slate node
 * @param type 'modal'/'bar'
 */
export function getPositionByNode(
  editor: IDomEditor,
  node: Node,
  type: string = 'modal'
): Partial<IPositionStyle> {
  // 默认情况下 { top: 0, left: 0 }
  const defaultStyle = { top: '0', left: '0' }

  const { selection } = editor
  if (selection == null) return defaultStyle // 默认 position

  // 根据 node 获取 elem
  const isVoidElem = Element.isElement(node) && editor.isVoid(node)
  const isInlineElem = Element.isElement(node) && editor.isInline(node)
  const elem = NODE_TO_ELEMENT.get(node)
  if (elem == null) return defaultStyle // 默认 position
  let {
    top: elemTop,
    left: elemLeft,
    height: elemHeight,
    width: elemWidth,
  } = elem.getBoundingClientRect()
  if (isVoidElem) {
    // void node ，重新计算 top 和 height
    const voidElem = getFirstVoidChild(elem)
    if (voidElem != null) {
      const { top, height } = voidElem.getBoundingClientRect()
      elemTop = top
      elemHeight = height
    }
  }

  // 获取 textContainer rect
  const containerRect = getTextContainerRect(editor)
  if (containerRect == null) return defaultStyle // 默认 position
  const {
    top: containerTop,
    left: containerLeft,
    width: containerWidth,
    height: containerHeight,
  } = containerRect

  // 存储计算结构
  const positionStyle: Partial<IPositionStyle> = {}

  // 获取 elem top left 和 container top left 的差值（< 0 则使用 0）
  let relativeTop = elemTop - containerTop
  let relativeLeft = elemLeft - containerLeft

  if (type === 'bar') {
    // bar - 1. left 对齐 elem.left ；2. 尽量显示在 elem 上方
    positionStyle.left = `${relativeLeft}px`
    if (relativeTop > 40) {
      // top > 40 则显示在上方
      positionStyle.bottom = `${containerHeight - relativeTop + 5}px` // 5px 间隙
    } else {
      // 否则，显示在下方
      positionStyle.top = `${relativeTop + elemHeight + 5}px` // 5px 间隙
    }

    return positionStyle
  }

  if (type === 'modal') {
    // modal - 1. top 和 elem 需要计算，尽量不遮挡 elem

    // 水平
    if (!isVoidElem) {
      // 非 void node - left 和 elem left 对齐
      positionStyle.left = `${relativeLeft}px`
    } else {
      if (isInlineElem) {
        // inline void node 需要计算
        if (relativeLeft > (containerWidth - elemWidth) / 2) {
          // elem 在 container 的右侧，则 modal 显示在 elem 左侧
          positionStyle.right = `${containerWidth - relativeLeft + 5}px`
        } else {
          // 否则 elem 在 container 左侧，则 modal 显示在 elem 右侧
          positionStyle.left = `${relativeLeft + elemWidth + 5}px`
        }
      } else {
        // block void node 水平靠左即可
        positionStyle.left = `20px`
      }
    }

    // 垂直
    if (isVoidElem) {
      // void node - top 和 elem top 对齐
      let t = relativeTop
      if (t < 0) t = 0 // top 不能小于 0
      positionStyle.top = `${t}px`
    } else {
      // 非 void node ，计算 top
      if (relativeTop > (containerHeight - elemHeight) / 2) {
        // elem 在 container 的下半部分，则 modal 显示在 elem 上方
        positionStyle.bottom = `${containerHeight - relativeTop + 5}px`
      } else {
        // elem 在 container 的上半部分，则 modal 显示在 elem 下方
        let t = relativeTop + elemHeight
        if (t < 0) t = 0
        positionStyle.top = `${t + 5}px`
      }
    }

    return positionStyle
  }

  throw new Error(`type '${type}' is invalid`)
}

/**
 * 异步修正 position ，不能超出 textContainer 边界
 * @param editor editor
 * @param $positionElem modal/bar
 */
export function correctPosition(editor: IDomEditor, $positionElem: Dom7Array) {
  // 异步，否则 DOM 尚未渲染
  promiseResolveThen(() => {
    // 获取 textContainer rect
    const containerRect = getTextContainerRect(editor)
    if (containerRect == null) return
    const {
      top: containerTop,
      left: containerLeft,
      width: containerWidth,
      height: containerHeight,
    } = containerRect

    // 获取 modal bar 的 rect
    const { top: positionElemTop, left: positionElemLeft } = $positionElem.offset()
    const positionElemWidth = $positionElem.width()
    const positionElemHeight = $positionElem.height()
    const relativeTop = positionElemTop - containerTop
    const relativeLeft = positionElemLeft - containerLeft

    // 获取 modal bar 设置的 style
    const styleStr = $positionElem.attr('style')

    if (styleStr.indexOf('top') >= 0) {
      // 设置了 top ，则有可能超过 textContainer 的下边界
      const d = relativeTop + positionElemHeight - containerHeight
      if (d > 0) {
        // 已超过 textContainer 的下边界，则上移
        const curTopStr = $positionElem.css('top')
        const curTop = parseInt(curTopStr.toString())
        let newTop = curTop - d
        if (newTop < 0) newTop = 0 // 不能超过 textContainer 上边界
        $positionElem.css('top', `${newTop}px`)
      }
    }

    if (styleStr.indexOf('bottom') >= 0) {
      // 设置了 bottom ，则有可能超过 textContainer 的上边界
      if (positionElemTop < 0) {
        // 已超出了上边界
        const curBottomStr = $positionElem.css('bottom')
        const curBottom = parseInt(curBottomStr.toString())
        const newBottom = curBottom - Math.abs(positionElemTop) // 保证上边界和 textContainer 对齐即可，下边界不管
        $positionElem.css('bottom', `${newBottom}px`)
      }
    }

    if (styleStr.indexOf('left') >= 0) {
      // 设置了 left ，则有可能超过 textContainer 的右边界
      const d = relativeLeft + positionElemWidth - containerWidth
      if (d > 0) {
        // 已超过 textContainer 的右边界，需左移
        const curLeftStr = $positionElem.css('left')
        const curLeft = parseInt(curLeftStr.toString())
        let newLeft = curLeft - d
        if (newLeft < 0) newLeft = 0 // 不能超过 textContainer 左边界
        $positionElem.css('left', `${newLeft}px`)
      }
    }

    if (styleStr.indexOf('right') >= 0) {
      // 设置了 right ，则有可能超过 textContainer 的左边界
      if (positionElemLeft < 0) {
        // 已超出了左边界
        const curRightStr = $positionElem.css('right')
        const curRight = parseInt(curRightStr.toString())
        const newRight = curRight - Math.abs(positionElemLeft) // 保证左边界和 textContainer 对齐即可，右边界不管
        $positionElem.css('right', `${newRight}px`)
      }
    }
  })
}
