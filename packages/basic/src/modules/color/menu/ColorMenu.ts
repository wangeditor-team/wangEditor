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
    const mark = this.mark

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<ul class="w-e-panel-content-color"></ul>')

      // 绑定事件（只在第一次绑定，不要重复绑定）
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
    let clearText = ''
    if (mark === 'color') clearText = '默认颜色'
    if (mark === 'bgColor') clearText = '清除背景色'
    const $clearLi = $(`
      <li data-value="0" class="clear">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M236.8 128L896 787.2V128H236.8z m614.4 704L192 172.8V832h659.2zM192 64h704c38.4 0 64 25.6 64 64v704c0 38.4-25.6 64-64 64H192c-38.4 0-64-25.6-64-64V128c0-38.4 25.6-64 64-64z"></path></svg>
        ${clearText}
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
