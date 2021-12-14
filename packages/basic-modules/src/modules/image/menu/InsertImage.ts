/**
 * @description insert image menu
 * @author wangfupeng
 */

import { Node } from 'slate'
import {
  IModalMenu,
  IDomEditor,
  genModalInputElems,
  genModalButtonElems,
  t,
} from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { genRandomStr } from '../../../utils/util'
import { IMAGE_SVG } from '../../../constants/icon-svg'
import { insertImageNode, isInsertImageMenuDisabled } from '../helper'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-image')
}

class InsertImage implements IModalMenu {
  readonly title = t('image.netImage')
  readonly iconSvg = IMAGE_SVG
  readonly tag = 'button'
  readonly showModal = true // 点击 button 时显示 modal
  readonly modalWidth = 300
  private $content: Dom7Array | null = null
  private readonly srcInputId = genDomID()
  private readonly altInputId = genDomID()
  private readonly hrefInputId = genDomID()
  private readonly buttonId = genDomID()

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
    return isInsertImageMenuDisabled(editor)
  }

  getModalPositionNode(editor: IDomEditor): Node | null {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { srcInputId, altInputId, hrefInputId, buttonId } = this

    // 获取 input button elem
    const [$srcContainer, $inputSrc] = genModalInputElems(t('image.src'), srcInputId)
    const [$altContainer, $inputAlt] = genModalInputElems(t('image.desc'), altInputId)
    const [$hrefContainer, $inputHref] = genModalInputElems(t('image.link'), hrefInputId)
    const [$buttonContainer] = genModalButtonElems(buttonId, t('common.ok'))

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, e => {
        e.preventDefault()
        const src = $(`#${srcInputId}`).val().trim()
        const alt = $(`#${altInputId}`).val().trim()
        const href = $(`#${hrefInputId}`).val().trim()
        this.insertImage(editor, src, alt, href)
        editor.hidePanelOrModal() // 隐藏 modal
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append inputs and button
    $content.append($srcContainer)
    $content.append($altContainer)
    $content.append($hrefContainer)
    $content.append($buttonContainer)

    // 设置 input val
    $inputSrc.val('')
    $inputAlt.val('')
    $inputHref.val('')

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $(`#${srcInputId}`).focus()
    })

    return $content
  }

  private insertImage(editor: IDomEditor, src: string, alt: string = '', href: string = '') {
    if (!src) return

    // 还原选区
    editor.restoreSelection()

    if (this.isDisabled(editor)) return

    // 插入图片
    insertImageNode(editor, src, alt, href)
  }
}

export default InsertImage
