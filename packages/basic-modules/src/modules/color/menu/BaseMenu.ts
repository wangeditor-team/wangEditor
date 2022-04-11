/**
 * @description color base menu
 * @author wangfupeng
 */

import { Editor, Range } from 'slate'
import { IDropPanelMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import $, { Dom7Array, DOMElement } from '../../../utils/dom'
import { CLEAN_SVG } from '../../../constants/icon-svg'

abstract class BaseMenu implements IDropPanelMenu {
  abstract readonly title: string
  abstract readonly iconSvg: string
  readonly tag = 'button'
  readonly showDropPanel = true // 点击 button 时显示 dropPanel
  protected abstract readonly mark: string
  private $content: Dom7Array | null = null

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
      match: n => {
        const type = DomEditor.getNodeType(n)

        if (type === 'pre') return true // 代码块
        if (Editor.isVoid(editor, n)) return true // void node

        return false
      },
      universal: true,
    })

    // 命中，则禁用
    if (match) return true
    return false
  }

  getPanelContentElem(editor: IDomEditor): DOMElement {
    const mark = this.mark

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<ul class="w-e-panel-content-color"></ul>')

      // 绑定事件（只在第一次绑定，不要重复绑定）
      $content.on('click', 'li', (e: Event) => {
        const { target } = e
        if (target == null) return
        e.preventDefault()

        const { selection } = editor
        if (selection == null) return

        const $li = $(target)
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
    if ($content == null) return document.createElement('ul')
    $content.empty() // 清空之后再重置内容

    // 当前选中文本的颜色之
    const selectedColor = this.getValue(editor)

    // 获取菜单配置
    const colorConf = editor.getMenuConfig(mark)
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
    if (mark === 'color') clearText = t('color.default')
    if (mark === 'bgColor') clearText = t('color.clear')
    const $clearLi = $(`
      <li data-value="0" class="clear">
        ${CLEAN_SVG}
        ${clearText}
      </li>
    `)
    $content.prepend($clearLi)

    return $content[0]
  }
}

export default BaseMenu
