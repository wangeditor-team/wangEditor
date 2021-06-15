/**
 * @description insert link menu
 * @author wangfupeng
 */

import { Editor, Transforms, Range, Node } from 'slate'
import { IModalMenu, IDomEditor, DomEditor, hideAllPanelsAndModals } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { genRandomStr } from '../../../utils/util'
import { genModalInputElems, genModalButtonElems } from '../../_helpers/menu'
import { LINK_SVG } from '../../_helpers/icon-svg'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-link')
}

class InsertLink implements IModalMenu {
  title = '插入链接'
  iconSvg = LINK_SVG
  tag = 'button'
  showModal = true // 点击 button 时显示 modal
  modalWidth = 300
  private $content: Dom7Array | null = null
  private textInputId = genDomID()
  private urlInputId = genDomID()
  private buttonId = genDomID()

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
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

  getModalPositionNode(editor: IDomEditor): Node | null {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { selection } = editor
    const { textInputId, urlInputId, buttonId } = this

    // 获取 input button elem
    const [$textContainer, $inputText] = genModalInputElems('链接文本', textInputId)
    const [$urlContainer, $inputUrl] = genModalInputElems('链接网址', urlInputId)
    const [$buttonContainer] = genModalButtonElems(buttonId, '确定')

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, e => {
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

    if (this.isDisabled(editor)) return

    // 判断选区是否折叠
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

export default InsertLink
