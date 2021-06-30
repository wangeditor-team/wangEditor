/**
 * @description image render elem
 * @author wangfupeng
 */

import { throttle } from 'lodash-es'
import { Element as SlateElement, Transforms } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { isNodeSelected } from '../_helpers/node'
import $, { Dom7Array } from '../../utils/dom'

/**
 * 渲染拖拽容器，修改图片尺寸
 * @param imageVnode image vnode
 * @param elemNode image node
 * @param editor editor
 */
function renderResizeContainer(imageVnode: VNode, elemNode: SlateElement, editor: IDomEditor) {
  const { id } = DomEditor.findKey(editor, elemNode) // node 唯一 id
  const $body = $('body')
  const containerId = `w-e-image-container-${id}`

  let originalX = 0
  let originalWith = 0
  let originalHeight = 0
  let revers = false // 是否反转。如向右拖拽 right-top 需增加宽度（非反转），但向右拖拽 left-top 则需要减少宽度（反转）

  function getImgElem(): Dom7Array {
    const $img = $(`#${containerId}`).find('img')
    if ($img.length === 0) throw new Error('Cannot find image elem')
    return $img
  }

  /**
   * 初始化。监听事件，记录原始数据
   */
  function init(clientX: number) {
    // 记录 img 原始宽高
    const $img = getImgElem()
    originalWith = $img.width()
    originalHeight = $img.height()

    // 记录当前 x 坐标值
    originalX = clientX

    // 监听 mousemove
    $body.on('mousemove', onMousemove)

    // 监听 mouseup
    $body.on('mouseup', onMouseup)
  }

  // mouseover callback （节流）
  const onMousemove = throttle((e: Event) => {
    e.preventDefault()

    const { clientX } = e as MouseEvent
    const gap = revers ? originalX - clientX : clientX - originalX // 考虑是否反转
    const newWidth = originalWith + gap
    const newHeight = originalHeight * (newWidth / originalWith) // 根据 width ，按比例计算 height

    // 实时修改 img 宽高 -【注意】这里只修改 DOM ，mouseup 时再统一不修改 node
    const $img = getImgElem()
    $img.css('width', `${newWidth}px`)
    $img.css('height', `${newHeight}px`)
  }, 100)

  function onMouseup(e: Event) {
    // 取消监听 mousemove
    $body.off('mousemove', onMousemove)

    const $img = getImgElem()
    const width = $img.width().toFixed(2)
    const height = $img.height().toFixed(2)

    // 修改 node
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        style: {
          // @ts-ignore
          ...imageVnode.style,
          width: `${width}px`,
          height: `${height}px`,
        },
      },
      { at: DomEditor.findPath(editor, elemNode) }
    )

    // 取消监听 mouseup
    $body.off('mouseup', onMouseup)
  }

  return (
    <div
      id={containerId}
      className="w-e-selected-image-container"
      on={{
        // 统一绑定拖拽触手的 mousedown 事件
        mousedown: (e: MouseEvent) => {
          const $target = $(e.target as Element)
          if (!$target.hasClass('w-e-image-dragger')) {
            // target 不是 .w-e-image-dragger 拖拽触手，则忽略
            return
          }
          e.preventDefault()

          if ($target.hasClass('left-top') || $target.hasClass('left-bottom')) {
            revers = true // 反转。向右拖拽，减少宽度
          }
          init(e.clientX) // 初始化
        },
      }}
    >
      {imageVnode}

      {/* 拖拽的触手，会统一在上级 DOM 绑定拖拽事件 */}
      <div className="w-e-image-dragger left-top"></div>
      <div className="w-e-image-dragger right-top"></div>
      <div className="w-e-image-dragger left-bottom"></div>
      <div className="w-e-image-dragger right-bottom"></div>
    </div>
  )
}

function renderImage(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // @ts-ignore
  const { src, alt = '', url = '', style = {} } = elemNode
  const { width = '', height = '' } = style
  const selected = isNodeSelected(editor, elemNode, 'image') // 图片是否选中

  const renderStyle: any = {}
  if (width) renderStyle.width = width
  if (height) renderStyle.height = height
  if (selected) renderStyle.boxShadow = '0 0 0 1px #B4D5FF' // 自定义 selected 样式，因为有拖拽触手

  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。
  const vnode = <img style={renderStyle} src={src} alt={alt} data-href={url} />

  // 未选中，则直接渲染图片
  if (!selected) {
    return vnode
  }

  // 选中，渲染 resize container
  return renderResizeContainer(vnode, elemNode, editor)
}

const renderImageConf = {
  type: 'image', // 和 elemNode.type 一致
  renderElem: renderImage,
}

export { renderImageConf }
