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

interface IImageSize {
  width?: string
  height?: string
}

function genContainerId(editor: IDomEditor, elemNode: SlateElement) {
  const { id } = DomEditor.findKey(editor, elemNode) // node 唯一 id
  return `w-e-image-container-${id}`
}

/**
 * 未选中时，渲染 image container
 */
function renderContainer(
  editor: IDomEditor,
  elemNode: SlateElement,
  imageVnode: VNode,
  imageInfo: IImageSize
): VNode {
  const { width, height } = imageInfo

  const style: any = {}
  if (width) style.width = width
  if (height) style.height = height

  const containerId = genContainerId(editor, elemNode)

  return (
    <div id={containerId} style={style} className="w-e-image-container">
      {imageVnode}
    </div>
  )
}

/**
 * 选中状态下，渲染 image container（渲染拖拽容器，修改图片尺寸）
 */
function renderResizeContainer(
  editor: IDomEditor,
  elemNode: SlateElement,
  imageVnode: VNode,
  imageInfo: IImageSize
) {
  const $body = $('body')
  const containerId = genContainerId(editor, elemNode)
  const { width, height } = imageInfo

  let originalX = 0
  let originalWith = 0
  let originalHeight = 0
  let revers = false // 是否反转。如向右拖拽 right-top 需增加宽度（非反转），但向右拖拽 left-top 则需要减少宽度（反转）
  let $container: Dom7Array | null = null

  function getContainerElem(): Dom7Array {
    const $container = $(`#${containerId}`)
    if ($container.length === 0) throw new Error('Cannot find image container elem')
    return $container
  }

  /**
   * 初始化。监听事件，记录原始数据
   */
  function init(clientX: number) {
    $container = getContainerElem()

    // 记录当前 x 坐标值
    originalX = clientX

    // 记录 img 原始宽高
    const $img = $container.find('img')
    if ($img.length === 0) throw new Error('Cannot find image elem')
    originalWith = $img.width()
    originalHeight = $img.height()

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
    if ($container == null) return
    $container.css('width', `${newWidth}px`)
    $container.css('height', `${newHeight}px`)
  }, 100)

  function onMouseup(e: Event) {
    // 取消监听 mousemove
    $body.off('mousemove', onMousemove)

    if ($container == null) return
    const newWidth = $container.width().toFixed(2)
    const newHeight = $container.height().toFixed(2)

    // 修改 node
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        style: {
          // @ts-ignore
          ...imageVnode.style,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        },
      },
      { at: DomEditor.findPath(editor, elemNode) }
    )

    // 取消监听 mouseup
    $body.off('mouseup', onMouseup)
  }

  const style: any = {}
  if (width) style.width = width
  if (height) style.height = height
  // style.boxShadow = '0 0 0 1px #B4D5FF' // 自定义 selected 样式，因为有拖拽触手

  return (
    <div
      id={containerId}
      style={style}
      className="w-e-image-container w-e-selected-image-container"
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

  const imageStyle: any = {}
  if (width) imageStyle.width = '100%'
  if (height) imageStyle.height = '100%'

  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。
  const vnode = <img style={imageStyle} src={src} alt={alt} data-href={url} />

  if (!selected) {
    // 未选中，渲染普通 image container
    return renderContainer(editor, elemNode, vnode, { width, height })
  }

  // 选中，渲染 resize container
  return renderResizeContainer(editor, elemNode, vnode, { width, height })
}

const renderImageConf = {
  type: 'image', // 和 elemNode.type 一致
  renderElem: renderImage,
}

export { renderImageConf }
