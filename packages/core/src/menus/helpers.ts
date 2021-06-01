/**
 * @description menu helpers
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { EDITOR_TO_TEXTAREA } from '../utils/weak-maps'
import { IPositionStyle, IPanel } from './interface'

/**
 * 清理 svg 的样式
 * @param $elem svg elem
 */
export function clearSvgStyle($elem: Dom7Array) {
  $elem.removeAttr('width')
  $elem.removeAttr('height')
  $elem.removeAttr('fill')
  $elem.removeAttr('class')
  $elem.removeAttr('t')
  $elem.removeAttr('p-id')

  const children = $elem.children()
  if (children.length) {
    clearSvgStyle(children)
  }
}

/**
 * 向下箭头 icon svg
 */
export function gen$downArrow() {
  const $downArrow = $(
    `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M498.7 655.8l-197.6-268c-8.1-10.9-0.3-26.4 13.3-26.4h395.2c13.6 0 21.4 15.4 13.3 26.4l-197.6 268c-6.6 9-20 9-26.6 0z"></path></svg>`
  )
  return $downArrow
}

/**
 * 计算 modal position style
 * @param editor editor
 */
export function getModalPosition(editor: IDomEditor): IPositionStyle {
  // 默认情况下 { top: 0, left: 0 }
  const defaultStyle = { top: '0', left: '0' }

  const textarea = EDITOR_TO_TEXTAREA.get(editor)
  if (textarea == null) return defaultStyle // 默认 position

  // 获取 textareaContainer
  const $textareaContainer = textarea.$textAreaContainer
  const containerWidth = $textareaContainer.width()
  const containerHeight = $textareaContainer.height()
  const { top: containerTop, left: containerLeft } = $textareaContainer.offset()

  const { selection } = editor
  if (selection == null) return defaultStyle // 默认 position

  // 获取当前选区的 rect
  const range = DomEditor.toDOMRange(editor, selection)
  const rangeRect = range.getClientRects()[0]
  if (rangeRect == null) return defaultStyle // 默认 position
  const { width: rangeWidth, height: rangeHeight, top: rangeTop, left: rangeLeft } = rangeRect

  // 存储计算结构
  const positionStyle: IPositionStyle = {}

  // 获取 选区 top left 和 container top left 的差值（< 0 则使用 0）
  let relativeTop = rangeTop - containerTop
  relativeTop = relativeTop < 0 ? 0 : relativeTop
  let relativeLeft = rangeLeft - containerLeft
  relativeLeft = relativeLeft < 0 ? 0 : relativeLeft

  // 判断水平位置：modal 显示在选区左侧，还是右侧？
  if (relativeLeft > containerWidth / 2) {
    // 选区 left 大于 containerWidth/2 （选区在 container 的右侧），则 modal 显示在选区左侧
    let r = containerWidth - relativeLeft - rangeWidth
    // 加一个间隙，不要太拥挤
    r += 5
    positionStyle.right = `${r}px`
  } else {
    // 否则（选区在 container 的左侧），modal 显示在选区右侧
    let l = relativeLeft
    // 加一个间隙，不要太拥挤
    l += 5
    positionStyle.left = `${l}px`
  }

  // 判断垂直的位置：modal 显示在选区上面，还是下面？
  if (relativeTop > containerHeight / 2) {
    // 选区 top  > containerHeight/2 （选区在 container 的下半部分），则 modal 显示在选区的上面
    let b = containerHeight - relativeTop
    // 加一个间隙，不要太拥挤
    b += 5
    positionStyle.bottom = `${b}px`
  } else {
    // 否则（选区在 container 的上半部分），则 modal 显示在选区的下面
    let t = relativeTop + rangeHeight
    // 加一个间隙，不要太拥挤
    t += 5
    positionStyle.top = `${t}px`
  }

  return positionStyle
}

// -----------------------------------------------------------------

const ALL_PANELS_AND_MODALS = new Set<IPanel>()

/**
 * 收集 dropPanel selectList 等
 */
export function gatherPanelAndModal(panel: IPanel) {
  ALL_PANELS_AND_MODALS.add(panel)
}

/**
 * 统一隐藏 dropPanel selectList 等
 */
export function hideAllPanelsAndModals() {
  ALL_PANELS_AND_MODALS.forEach(panel => panel.hide())
}
$('body').on('click', debounce(hideAllPanelsAndModals, 100))
