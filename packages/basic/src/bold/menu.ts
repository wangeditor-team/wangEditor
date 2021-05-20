/**
 * @description bold menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'

class BoldMenu implements IMenuItem {
  title = '加粗'
  iconClass = 'w-e-icon-bold'
  tag = 'button'

  /**
   * 获取：是否加粗
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n.bold === true,
      universal: true,
    })

    const isBold = !!match
    return isBold
  }
  isDisabled(editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type } = n

        // 检测是否在代码块
        if (type === 'pre') return true

        // TODO 检测是否 void

        return false
      },
      universal: true,
    })

    if (match) return true
    return false
  }

  /**
   * 执行 bold 命令
   * @param editor editor
   * @param value 是否加粗
   */
  cmd(editor: IDomEditor, value?: string | boolean) {
    if (value) {
      // 已加粗，则取消
      editor.removeMark('bold')
    } else {
      // 未加粗，则执行
      editor.addMark('bold', true)
    }
  }
}

export default {
  key: 'bold',
  factory() {
    return new BoldMenu()
  },
}
