/**
 * @description video render elem
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'
import { isNodeSelected } from './_helpers/node'

function renderVideo(elemNode: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // @ts-ignore
  const { src = '' } = elemNode

  const renderStyle: any = {}

  // 是否选中
  const selected = isNodeSelected(editor, elemNode, 'video')
  renderStyle.boxShadow = selected ? '0 0 0 3px #B4D5FF' : 'none'
  // TODO 抽离选中样式

  let vnode: VNode
  if (src.trim().indexOf('<iframe') === 0) {
    // iframe 形式，第三方视频
    vnode = (
      <div
        contentEditable={false}
        className="w-e-textarea-video-container"
        style={renderStyle}
        innerHTML={src} // 内嵌第三方 iframe 视频
      ></div>
    )
  } else {
    // 其他，mp4 格式
    vnode = (
      <div contentEditable={false} className="w-e-textarea-video-container" style={renderStyle}>
        <video controls width="300">
          <source src={src} type="video/mp4" />
          {`Sorry, your browser doesn't support embedded videos.\n 抱歉，浏览器不支持 video 视频`}
        </video>
      </div>
    )
  }

  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。

  return vnode
}

const renderVideoConf = {
  type: 'video', // 和 elemNode.type 一致
  renderElem: renderVideo,
}

export { renderVideoConf }
