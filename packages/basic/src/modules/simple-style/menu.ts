/**
 * @description text style menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'

class TextStyleMenu implements IMenuItem {
  mark: string
  title: string
  iconSvg: string
  tag = 'button'

  constructor(mark: string, title: string, iconSvg: string) {
    this.mark = mark
    this.title = title
    this.iconSvg = iconSvg
  }

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
  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // 代码
        if (type === 'pre') return true

        if (mark === 'bold') {
          // header 中禁用 bold
          if (type.startsWith('header')) return true
        }

        // void
        if (Editor.isVoid(editor, n)) return true

        return false
      },
      universal: true,
    })

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

function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new TextStyleMenu(mark, title, iconSvg)
    },
  }
}

export default genMenuConf
