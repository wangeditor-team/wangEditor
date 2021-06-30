/**
 * @description image width 30%
 * @author wangfupeng
 */

import { Transforms, Node } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { checkNodeType, getSelectedNodeByType } from '../../_helpers/node'

// TODO 宽度 30% 50% 100%
// 抽离一个 baseClass

class ImageWidth implements IButtonMenu {
  title = '30%'
  tag = 'button'
  private value = '30%'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  private getSelectedNode(editor: IDomEditor): Node | null {
    return getSelectedNodeByType(editor, 'image')
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

    // @ts-ignore
    const { style = {} } = imageNode
    const newStyle = {
      ...style,
      width: this.value, // 修改 width
      height: '', // 清空 height
    }

    Transforms.setNodes(
      editor,
      // @ts-ignore
      { style: newStyle },
      {
        match: n => checkNodeType(n, 'image'),
      }
    )
  }
}

export default ImageWidth
