/**
 * @description base menu
 * @author wangfupeng
 */

import { Editor, Node, Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
// import { ListItemElement, NumberedListElement, BulletedListElement } from '../custom-types'

function checkList(n: Node): boolean {
  const type = DomEditor.getNodeType(n)
  return ['bulleted-list', 'numbered-list'].includes(type)
}

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

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        const type = DomEditor.getNodeType(n)

        if (type === 'pre') return true // 代码块
        if (Editor.isVoid(editor, n)) return true // void node
        if (type === 'table') return true // table

        return false
      },
      universal: true,
    })

    // 命中，则禁用
    if (nodeEntry) return true
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
