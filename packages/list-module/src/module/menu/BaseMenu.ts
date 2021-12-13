/**
 * @description base menu
 * @author wangfupeng
 */

import { Editor, Node, Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { checkList } from '../helper'
// import { ListItemElement, NumberedListElement, BulletedListElement } from '../custom-types'

abstract class BaseMenu implements IButtonMenu {
  abstract readonly type: string // 'bulleted-list' / 'numbered-list'
  abstract readonly title: string
  abstract readonly iconSvg: string
  readonly tag = 'button'

  private getListNode(editor: IDomEditor): Node | null {
    const { type } = this
    return DomEditor.getSelectedNodeByType(editor, type)
  }

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const node = this.getListNode(editor)
    return !!node
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const notMatch = selectedElems.some((elem: Node) => {
      if (Editor.isVoid(editor, elem) && Editor.isBlock(editor, elem)) return true

      const { type } = elem
      if (['pre', 'code', 'table'].includes(type)) return true
    })
    if (notMatch) return true

    return false
  }

  /**
   * 获取当前选区匹配的 type 'bulleted-list' / 'numbered-list'
   * @param editor editor
   */
  private getMatchListType(editor: IDomEditor): string {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => checkList(n),
      universal: true,
    })
    if (nodeEntry == null) return ''
    const [n] = nodeEntry
    return DomEditor.getNodeType(n)
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    const { type } = this
    const active = this.isActive(editor)

    // 移除 ul ol 的父节点
    Transforms.unwrapNodes(editor, {
      match: n => checkList(n),
      split: true,
    })
    // 设置当前节点 type
    Transforms.setNodes(editor, {
      type: active ? 'paragraph' : 'list-item',
    })

    const listNode = { type, children: [] }
    if (!active) {
      // 非 list 设置为 list ，则外层再包裹一个 listNode
      Transforms.wrapNodes(editor, listNode)
    }
    const matchType = this.getMatchListType(editor)
    if (matchType != '' && matchType !== type) {
      // list 却换 type（如 ul 切换为 ol），则外层再包裹一个 listNode
      Transforms.wrapNodes(editor, listNode)
    }
  }
}

export default BaseMenu
