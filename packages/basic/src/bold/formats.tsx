/**
 * @description register formats
 * @author wangfupeng
 */

import { Text as SlateText, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '@wangeditor/core'

/**
 * 添加文本样式
 * @param node slate node
 * @param vnode vnode
 * @returns vnode
 */
export function addTextStyle(node: SlateText | SlateElement, vnode: VNode): VNode {
  // @ts-ignore
  const { bold } = node
  let styleVnode: VNode = vnode

  if (bold) {
    styleVnode = <strong>{styleVnode}</strong>
  }

  return styleVnode
}

/**
 * render paragraph elem
 * @param elemNode slate elem
 * @param children children
 * @param editor editor
 * @returns vnode
 */
function renderParagraph(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const vnode = <p>{children}</p>
  return vnode
}

export const renderParagraphConf = {
  type: 'paragraph',
  renderFn: renderParagraph,
}
