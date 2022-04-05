/**
 * @description emotion menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDropPanelMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import $, { Dom7Array, DOMElement } from '../../../utils/dom'
import { EMOTION_SVG } from '../../../constants/icon-svg'

class EmotionMenu implements IDropPanelMenu {
  readonly title = t('emotion.title')
  readonly iconSvg = EMOTION_SVG
  readonly tag = 'button'
  readonly showDropPanel = true // 点击 button 时显示 dropPanel
  private $content: Dom7Array | null = null

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 droPanel 之前，不需要执行其他代码
    // 此处空着即可
  }

  getValue(editor: IDomEditor): string | boolean {
    // 不需要 getValue
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 不需要 active
    return false
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

    if (match) return true
    return false
  }

  getPanelContentElem(editor: IDomEditor): DOMElement {
    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<ul class="w-e-panel-content-emotion"></ul>')

      // 绑定事件（仅第一次绑定，不可重复绑定）
      $content.on('click', 'li', (e: Event) => {
        const { target } = e
        if (target == null) return
        e.preventDefault()

        const $li = $(target)
        const emotionStr = $li.text()
        editor.insertText(emotionStr)
      })

      this.$content = $content
    }

    const $content = this.$content
    if ($content == null) return document.createElement('ul')
    $content.empty() // 清空之后再重置内容

    // 获取菜单配置
    const colorConf = editor.getMenuConfig('emotion')
    const { emotions = [] } = colorConf
    // 根据菜单配置生成 panel content
    emotions.forEach((emotion: string) => {
      const $li = $(`<li>${emotion}</li>`)
      $content.append($li)
    })

    return $content[0]
  }
}

export default EmotionMenu
