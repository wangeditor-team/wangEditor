/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { ISelectMenu, IDomEditor, IOption } from '@wangeditor/core'

abstract class BaseMenu implements ISelectMenu {
  abstract title: string
  abstract iconSvg: string
  abstract mark: string // 'fontSize'/'fontFamily'
  tag = 'select'
  width = 60

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
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n
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
