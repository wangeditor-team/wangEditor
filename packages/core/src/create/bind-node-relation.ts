/**
 * @description 绑定 node 的关系
 * @author wangfupeng
 */

import { Element, Editor, Node, Ancestor } from 'slate'
import { IDomEditor } from '../editor/interface'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'

/**
 * createEditor 未传递 selector 时，绑定 node 的关系（ NODE_TO_PARENT, NODE_TO_INDEX 等 ）
 * @param node node
 * @param index index
 * @param parent parent node
 * @param editor editor
 */
function bindNodeRelation(node: Node, index: number, parent: Ancestor, editor: IDomEditor) {
  // 设置相关 weakMap 信息
  NODE_TO_INDEX.set(node, index)
  NODE_TO_PARENT.set(node, parent)

  if (Element.isElement(node)) {
    const { children = [] } = node
    children.forEach((child: Node, i: number) => bindNodeRelation(child, i, node, editor)) // 递归子节点

    const isVoid = Editor.isVoid(editor, node)
    if (isVoid) {
      const [[text]] = Node.texts(node)
      // 记录 text 相关 weakMap
      NODE_TO_INDEX.set(text, 0)
      NODE_TO_PARENT.set(text, node)
    }
  }
}

export default bindNodeRelation
