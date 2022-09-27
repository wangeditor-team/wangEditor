/**
 * @description base menu
 * @author wangfupeng
 */

import { Editor, Node, Transforms, Element } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { ListItemElement } from '../custom-types'

abstract class BaseMenu implements IButtonMenu {
  readonly type = 'list-item'
  abstract readonly ordered: boolean
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
    if (node == null) return false
    const { ordered = false } = node as ListItemElement
    return ordered === this.ordered
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const notMatch = selectedElems.some((elem: Element) => {
      if (Editor.isVoid(editor, elem) && Editor.isBlock(editor, elem)) return true

      const { type } = elem as Element
      if (['pre', 'code', 'table'].includes(type)) return true
    })
    if (notMatch) return true

    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    const active = this.isActive(editor)
    if (active) {
      // 如果当前 active ，则转换为 p 标签
      Transforms.setNodes(editor, {
        type: 'paragraph',
        ordered: undefined,
        level: undefined,
      })
    } else {
      // 否则，转换为 list-item
      Transforms.setNodes(editor, {
        type: 'list-item',
        ordered: this.ordered, // 有序/无序
        indent: undefined,
      })
    }
  }
}

export default BaseMenu
