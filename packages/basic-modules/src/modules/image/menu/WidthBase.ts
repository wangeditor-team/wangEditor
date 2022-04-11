/**
 * @description image width base class
 * @author wangfupeng
 */

import { Transforms, Node } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { ImageElement } from '../custom-types'

abstract class ImageWidthBaseClass implements IButtonMenu {
  abstract readonly title: string // 菜单标题
  readonly tag = 'button'
  abstract readonly value: string // css width 的值

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  private getSelectedNode(editor: IDomEditor): Node | null {
    return DomEditor.getSelectedNodeByType(editor, 'image')
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const imageNode = this.getSelectedNode(editor)
    if (imageNode == null) {
      // 选区未处于 image node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    const imageNode = this.getSelectedNode(editor)
    if (imageNode == null) return

    // 隐藏 hoverbar
    const hoverbar = DomEditor.getHoverbar(editor)
    if (hoverbar) hoverbar.hideAndClean()

    const { style = {} } = imageNode as ImageElement
    const props: Partial<ImageElement> = {
      style: {
        ...style,
        width: this.value, // 修改 width
        height: '', // 清空 height
      },
    }

    Transforms.setNodes(editor, props, {
      match: n => DomEditor.checkNodeType(n, 'image'),
    })
  }
}

export default ImageWidthBaseClass
