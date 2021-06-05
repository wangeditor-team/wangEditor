/**
 * @description color menu
 * @author wangfupeng
 */

import { Editor, Range } from 'slate'
import { IDropPanelMenu, IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { CLEAN_SVG } from '../../_helpers/icon-svg'
import { getMenuConf } from '../../_helpers/menu'

class ColorMenu implements IDropPanelMenu {
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

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 droPanel 之前，不需要执行其他代码
    // 此处空着即可
  }

  getValue(editor: IDomEditor): string | boolean {
    const mark = this.mark
    const curMarks = Editor.marks(editor)
    // @ts-ignore
    if (curMarks && curMarks[mark]) return curMarks[mark]
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const color = this.getValue(editor)
    return !!color
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
    const mark = this.mark

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<ul class="w-e-panel-content-color"></ul>')

      // 绑定事件（只在第一次绑定，不要重复绑定）
      $content.on('mousedown', 'li', (e: Event) => {
        e.preventDefault()

        const { selection } = editor
        if (selection == null) return
        if (Range.isCollapsed(selection)) return

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
    const colorConf = getMenuConf(editor, mark)
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
    let clearText = ''
    if (mark === 'color') clearText = '默认颜色'
    if (mark === 'bgColor') clearText = '清除背景色'
    const $clearLi = $(`
      <li data-value="0" class="clear">
        ${CLEAN_SVG}
        ${clearText}
      </li>
    `)
    $content.prepend($clearLi)

    return $content
  }
}

export default ColorMenu
