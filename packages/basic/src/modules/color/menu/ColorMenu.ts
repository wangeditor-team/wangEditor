/**
 * @description color menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'

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

        // 修改文本样式
        if (val === '0') {
          Editor.removeMark(editor, mark)
        } else {
          Editor.addMark(editor, mark, val)
        }
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

    // 清除颜色
    const $clearLi = $(`
      <li data-value="0" class="clear">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2335" width="200" height="200"><path d="M512 620.544l253.3376 253.3376a76.6976 76.6976 0 1 0 108.544-108.544L620.6464 512l253.2352-253.3376a76.6976 76.6976 0 1 0-108.544-108.544L512 403.3536 258.6624 150.1184a76.6976 76.6976 0 1 0-108.544 108.544L403.3536 512 150.1184 765.3376a76.6976 76.6976 0 1 0 108.544 108.544L512 620.6464z"></path></svg>
        清除颜色
      </li>
    `)
    $content.prepend($clearLi)

    return $content
  }

  private getConfig(editor: IDomEditor): { [key: string]: any } {
    const key = this.mark
    const { menuConf } = editor.getConfig()
    const colorConf = menuConf[key]
    return colorConf || {}
  }
}

export default ColorMenu
