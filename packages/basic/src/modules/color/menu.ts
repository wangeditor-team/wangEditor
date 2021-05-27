/**
 * @description color menu
 * @author wangfupeng
 */

import { Editor, Text } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../utils/dom'

class ColorMenu implements IMenuItem {
  title: string
  iconSvg: string
  tag = 'button'
  showDropPanel = true // 点击 button 时显示 dropPanel
  private mark: string
  private $content: Dom7Array | null = null

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

  getPanelContentElem(editor: IDomEditor): Dom7Array {
    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<ul class="w-e-panel-content-color"></ul>')

      // 绑定事件（只在第一次绑定，不要重复绑定）
      const mark = this.mark
      $content.on('mousedown', 'li', (e: Event) => {
        e.preventDefault()
        // @ts-ignore
        const $li = $(e.target)
        const val = $li.attr('data-value')
        Editor.addMark(editor, mark, val)
      })

      this.$content = $content
    }
    const $content = this.$content
    if ($content == null) return $()
    $content.html('') // 清空之后再重置内容

    // 当前选中文本的颜色之
    const selectedColor = this.getValue(editor)

    // 获取菜单配置
    const colorConf = this.getConfig(editor)
    const { colors = [] } = colorConf
    // 根据菜单配置生成 panel content
    colors.forEach((color: string) => {
      const $block = $(`<div class="color-block" data-value="${color}"></div>`)
      $block.css('background-color', color)

      const $li = $(`<li data-value="${color}"></li>`)
      if (selectedColor === color) {
        $li.addClass('active')
      }
      $li.append($block)

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
