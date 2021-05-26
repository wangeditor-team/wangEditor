/**
 * @description color menu
 * @author wangfupeng
 */

import { Editor, Transforms, Text } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'

class ColorMenu implements IMenuItem {
  title: string
  iconSvg: string
  tag = 'button'
  withDownArrow = true // menu button 显示一个箭头
  mark: string

  constructor(mark: string, title: string, iconSvg: string) {
    this.mark = mark
    this.title = title
    this.iconSvg = iconSvg
  }

  getValue(editor: IDomEditor): string | boolean {
    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      // 找到有 color/bgColor 的 text 节点
      match: n => {
        if (Text.isText(n)) {
          // @ts-ignore
          if (n[mark] !== null) {
            return true
          }
        }
        return false
      },
      universal: true,
    })

    if (!match) {
      return '' // 未匹配到，返回空
    }

    const [n] = match
    // @ts-ignore 返回颜色值
    return n[mark]
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // 代码
        if (type === 'pre') return true

        // void
        if (Editor.isVoid(editor, n)) return true

        return false
      },
      universal: true,
    })

    if (match) return true
    return false
  }

  cmd(editor: IDomEditor, value?: string | boolean) {
    console.log('color cmd')
  }
}

function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new ColorMenu(mark, title, iconSvg)
    },
  }
}

export default genMenuConf
