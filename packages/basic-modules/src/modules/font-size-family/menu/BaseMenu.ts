/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { ISelectMenu, IDomEditor, DomEditor, IOption } from '@wangeditor/core'

abstract class BaseMenu implements ISelectMenu {
  abstract readonly title: string
  abstract readonly iconSvg: string
  abstract readonly mark: string // 'fontSize'/'fontFamily'
  readonly tag = 'select'
  readonly width = 80

  abstract getOptions(editor: IDomEditor): IOption[]

  isActive(editor: IDomEditor): boolean {
    // select menu 会显示 selected value ，用不到 active
    return false
  }

  getValue(editor: IDomEditor): string | boolean {
    const mark = this.mark
    const curMarks = Editor.marks(editor)
    // @ts-ignore
    if (curMarks && curMarks[mark]) return curMarks[mark]
    return ''
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      match: n => {
        const type = DomEditor.getNodeType(n)
        if (type === 'pre') return true // 代码块
        if (Editor.isVoid(editor, n)) return true // void node

        return false
      },
      universal: true,
    })

    // 匹配到，则禁用
    if (match) return true
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const mark = this.mark
    if (value) {
      editor.addMark(mark, value)
    } else {
      editor.removeMark(mark)
    }
  }
}

export default BaseMenu
