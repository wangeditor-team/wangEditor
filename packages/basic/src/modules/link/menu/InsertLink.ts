/**
 * @description insert link menu
 * @author wangfupeng
 */

import { Editor, Transforms, Range } from 'slate'
import { IMenuItem, IDomEditor, DomEditor, hideAllPanelsAndModals } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { genRandomStr } from '../../../utils/util'

function genLabelContainer(): Dom7Array {
  return $('<label class="babel-container"></label>')
}

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-link')
}

class InsertLink implements IMenuItem {
  title = '插入链接'
  iconSvg =
    '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M255.754083 385.598463c106.236311-106.236311 275.427474-102.301633 381.663784 0 23.608069 27.542747 23.608069 62.954851 0 86.56292-27.542747 23.608069-62.954851 23.608069-86.56292 0-27.542747-27.542747-66.889529-43.28146-106.236311-43.28146-43.28146 0-78.693564 15.738713-106.236311 43.28146l-177.060519 177.060519c-59.020173 59.020173-59.020173 153.45245 0 212.472622 31.477426 27.542747 66.889529 43.28146 106.236311 43.281461 43.28146 0 78.693564-15.738713 106.236311-43.281461l74.758886-74.758885c23.608069-23.608069 59.020173-23.608069 86.56292-3.934678 23.608069 27.542747 23.608069 62.954851 0 86.56292L460.357349 944.322767c-106.236311 106.236311-275.427474 106.236311-381.663785 0-106.236311-106.236311-102.301633-275.427474 0-381.663785l177.060519-177.060519z" p-id="6444"></path><path d="M562.658982 78.693564C668.895293-27.542747 838.086455-23.608069 944.322767 78.693564c106.236311 102.301633 106.236311 275.427474 0 381.663785l-177.060519 177.060518c-106.236311 106.236311-275.427474 106.236311-381.663785 0l-3.934678-3.934678c-19.673391-23.608069-19.673391-59.020173 3.934678-78.693564 27.542747-23.608069 62.954851-23.608069 86.56292 0 27.542747 27.542747 66.889529 43.28146 106.236312 43.28146 43.28146 0 78.693564-15.738713 106.236311-43.28146l177.060518-177.060518c59.020173-59.020173 59.020173-153.45245 0-212.472623-27.542747-27.542747-66.889529-43.28146-106.236311-43.28146-43.28146 0-78.693564 15.738713-106.236311 43.28146l-74.758886 74.758886c-27.542747 23.608069-62.954851 23.608069-86.56292 0-23.608069-27.542747-23.608069-62.954851 0-86.56292L562.658982 78.693564z"></path></svg>'
  tag = 'button'
  showModal = true // 点击 button 时显示 modal
  private $content: Dom7Array | null = null
  private textInputId = genDomID()
  private urlInputId = genDomID()
  private buttonId = genDomID()

  getValue(editor: IDomEditor): string | boolean {
    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        return n.type === 'link'
      },
      universal: true,
    })

    if (nodeEntry == null) return false
    return true
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

        // 当前处于链接之内
        if (type === 'link') return true

        return false
      },
      universal: true,
    })

    if (match) return true
    return false
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { selection } = editor
    const { textInputId, urlInputId, buttonId } = this

    // 文本 input elem
    const $textContainer = genLabelContainer()
    $textContainer.append('<span>链接文本</span>')
    const $inputText = $(`<input type="text" id="${textInputId}">`)
    $textContainer.append($inputText)

    // 链接网址 input elem
    const $urlContainer = genLabelContainer()
    $urlContainer.append($('<span>链接网址</span>'))
    const $inputUrl = $(`<input type="text" id="${urlInputId}">`)
    $urlContainer.append($inputUrl)

    // button
    const $buttonContainer = $('<div class="button-container"></div>')
    const $button = $(`<button id="${buttonId}">插入链接</button>`)
    $buttonContainer.append($button)

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div style="width: 300px;"></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', 'button', e => {
        e.preventDefault()
        const text = $(`#${textInputId}`).val()
        const url = $(`#${urlInputId}`).val()
        this.insertLink(editor, text, url)
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append inputs and button
    $content.append($textContainer)
    $content.append($urlContainer)
    $content.append($buttonContainer)

    // 设置 input val
    if (selection == null || Range.isCollapsed(selection)) {
      // 选区无内容
      $inputText.val('')
    } else {
      // 选区有内容
      const selectionText = Editor.string(editor, selection)
      $inputText.val(selectionText)
    }
    $inputUrl.val('')

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $(`#${textInputId}`).focus()
    })

    return $content
  }

  /**
   * 插入 link
   * @param editor editor
   * @param text text
   * @param url url
   */
  private insertLink(editor: IDomEditor, text: string, url: string) {
    if (!url) {
      hideAllPanelsAndModals() // 隐藏 modal
      return
    }
    if (!text) text = url // 无 text 则用 url 代替

    // 还原选区
    DomEditor.restoreSelection(editor)
    const { selection } = editor
    if (selection == null) return
    const isCollapsed = Range.isCollapsed(selection)

    // 新建一个 link node
    const linkNode = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text }] : [],
    }

    // 执行：插入链接
    if (isCollapsed) {
      Transforms.insertNodes(editor, linkNode)
    } else {
      Transforms.wrapNodes(editor, linkNode, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }

    // 隐藏 modal
    hideAllPanelsAndModals()
  }
}

export default {
  key: 'insertLink',
  factory() {
    return new InsertLink()
  },
}
