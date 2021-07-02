/**
 * @description simply style base menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'

abstract class BaseMenu implements IButtonMenu {
  abstract mark: string
  abstract title: string
  abstract iconSvg: string
  abstract hotkey: string
  tag = 'button'

  /**
   * 获取：是否有 mark
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n[mark] === true,
      universal: true,
    })
    return !!match
  }

  isActive(editor: IDomEditor): boolean {
    const isMark = this.getValue(editor)
    return !!isMark
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      match: n => {
        const type = DomEditor.getNodeType(n)

        if (type === 'pre') return true // 代码块
        if (Editor.isVoid(editor, n)) return true // void node

        if (mark === 'bold') {
          // header 中禁用 bold
          if (type.startsWith('header')) return true
        }

        return false
      },
      universal: true,
    })

    // 命中，则禁用
    if (match) return true
    return false
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value 是否有 mark
   */
  exec(editor: IDomEditor, value: string | boolean) {
    const mark = this.mark
    if (value) {
      // 已，则取消
      editor.removeMark(mark)
    } else {
      // 没有，则执行
      editor.addMark(mark, true)
    }
  }
}

export default BaseMenu
