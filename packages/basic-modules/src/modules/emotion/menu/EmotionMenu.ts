/**
 * @description emotion menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IDropPanelMenu, IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { EMOTION_SVG } from '../../../constants/icon-svg'
import { getMenuConf } from '../../_helpers/menu'

class EmotionMenu implements IDropPanelMenu {
  title = '表情'
  iconSvg = EMOTION_SVG
  tag = 'button'
  showDropPanel = true // 点击 button 时显示 dropPanel
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
      const $content = $('<ul class="w-e-panel-content-emotion"></ul>')

      // 绑定事件（仅第一次绑定，不可重复绑定）
      $content.on('mousedown', 'li', (e: Event) => {
        e.preventDefault()

        // @ts-ignore
        const $li = $(e.target)
        const emotionStr = $li.text()
        editor.insertText(emotionStr)
      })

      this.$content = $content
    }

    const $content = this.$content
    if ($content == null) return $()
    $content.html('') // 清空之后再重置内容

    // 获取菜单配置
    const colorConf = getMenuConf(editor, 'emotion')
    const { emotions = [] } = colorConf
    // 根据菜单配置生成 panel content
    emotions.forEach((emotion: string) => {
      const $li = $(`<li>${emotion}</li>`)
      $content.append($li)
    })

    return $content
  }
}

export default EmotionMenu
