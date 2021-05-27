/**
 * @description color menu
 * @author wangfupeng
 */

import { Editor, Text } from 'slate'
import { IMenuItem, IDomEditor, DropPanel } from '@wangeditor/core'
import $, { Dom7Array } from '../_utils/dom'

class ColorMenu implements IMenuItem {
  title: string
  iconSvg: string
  tag = 'button'
  withDownArrow = true // menu button 显示一个箭头
  mark: string
  private dropPanel: DropPanel | null = null

  constructor(mark: string, title: string, iconSvg: string) {
    this.mark = mark
    this.title = title
    this.iconSvg = iconSvg
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

  cmd(editor: IDomEditor, value: string | boolean, $menuElem?: Dom7Array) {
    if ($menuElem == null) return
    const mark = this.mark

    if (this.dropPanel == null) {
      // 初次创建
      const dropPanel = new DropPanel()
      const $content = this.genPanelContent(editor)
      dropPanel.renderContent($content)
      dropPanel.appendTo($menuElem)
      dropPanel.show()

      // 设置宽度
      const { $elem } = dropPanel
      $elem.css('width', '262px')

      // 初次创建，绑定事件
      $elem.on('mousedown', 'li', (e: Event) => {
        e.preventDefault()
        // @ts-ignore
        const $li = $(e.target)
        const val = $li.attr('data-value')
        Editor.addMark(editor, mark, val)
      })
    } else {
      // 不是初次创建
      const dropPanel = this.dropPanel
      if (dropPanel.isShow) {
        // 当前处于显示状态，则隐藏
        dropPanel.hide()
      } else {
        // 当前未处于显示状态，则重新渲染内容 ，并显示
        const $content = this.genPanelContent(editor)
        dropPanel.renderContent($content)
        dropPanel.show()
      }
    }
  }

  private genPanelContent(editor: IDomEditor): Dom7Array {
    const $content = $('<ul></ul>')

    const selectedColor = this.getValue(editor)

    const colorConf = this.getConfig(editor)
    const { colors = [] } = colorConf

    colors.forEach((color: string) => {
      const $li = $(`<li data-value="${color}"></li>`)
      $li.css('background-color', color)

      if (selectedColor === color) {
        $li.css('border-color', '#666')
      }

      $content.append($li)
    })

    return $content
  }

  private getConfig(editor: IDomEditor): { [key: string]: any } {
    const key = this.mark
    const { menuConf } = editor.getConfig()
    const colorConf = menuConf[key]
    return colorConf || {}
  }
}

function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new ColorMenu(mark, title, iconSvg)
    },

    // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
    // 用户也可以修改这个配置
    config: {
      colors: [
        '#000000',
        '#262626',
        '#595959',
        '#8c8c8c',
        '#bfbfbf',
        '#d9d9d9',
        '#e9e9e9e',
        '#f5f5f5',
        '#fafafa',
        '#ffffff', // 一行
        '#e13c39',
        '#e75f33',
        '#eb903a',
        '#f5db4d',
        '#72c040',
        '#59bfc0',
        '#4290f7',
        '#3658e2',
        '#6a39c9',
        '#d84493', // 一行
        '#fbe9e6',
        '#fcede1',
        '#fcefd4',
        '#fcfbcf',
        '#e7f6d5',
        '#daf4f0',
        '#d9edfa',
        '#e0e8fa',
        '#ede1f8',
        '#f6e2ea', // 一行
        // TODO 参考语雀编辑器，继续补充其他颜色
      ],
    },
  }
}

export default genMenuConf
