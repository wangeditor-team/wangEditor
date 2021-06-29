/**
 * @description editor image menu
 * @author wangfupeng
 */

import { Node, Transforms, Range } from 'slate'
import { IModalMenu, IDomEditor, DomEditor, hideAllPanelsAndModals } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { genRandomStr } from '../../../utils/util'
import { genModalInputElems, genModalButtonElems } from '../../_helpers/menu'
import { getSelectedNodeByType } from '../../_helpers/node'
import { PENCIL_SVG } from '../../_helpers/icon-svg'
import { updateImageNode } from '../helper'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-edit-image')
}

class EditImage implements IModalMenu {
  title = '编辑图片'
  iconSvg = PENCIL_SVG
  tag = 'button'
  showModal = true // 点击 button 时显示 modal
  modalWidth = 300
  private $content: Dom7Array | null = null
  private srcInputId = genDomID()
  private altInputId = genDomID()
  private urlInputId = genDomID()
  private buttonId = genDomID()

  getValue(editor: IDomEditor): string | boolean {
    // 编辑图片，用不到 getValue
    return ''
  }

  private getImageNode(editor: IDomEditor): Node | null {
    return getSelectedNodeByType(editor, 'image')
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    const imageNode = getSelectedNodeByType(editor, 'image')

    // 未匹配到 image node 则禁用
    if (imageNode == null) return true
    return false
  }

  getModalPositionNode(editor: IDomEditor): Node | null {
    return this.getImageNode(editor)
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { srcInputId, altInputId, urlInputId, buttonId } = this

    const selectedImageNode = this.getImageNode(editor)
    if (selectedImageNode == null) {
      throw new Error('Not found selected image node')
    }

    // 获取 input button elem
    const [$srcContainer, $inputSrc] = genModalInputElems('图片地址', srcInputId)
    const [$altContainer, $inputAlt] = genModalInputElems('描述文字', altInputId)
    const [$urlContainer, $inputUrl] = genModalInputElems('图片链接', urlInputId)
    const [$buttonContainer] = genModalButtonElems(buttonId, '确定')

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, e => {
        e.preventDefault()

        const src = $(`#${srcInputId}`).val()
        const alt = $(`#${altInputId}`).val()
        const url = $(`#${urlInputId}`).val()
        this.updateImage(editor, src, alt, url)
        hideAllPanelsAndModals() // 隐藏 modal
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append inputs and button
    $content.append($srcContainer)
    $content.append($altContainer)
    $content.append($urlContainer)
    $content.append($buttonContainer)

    // 设置 input val
    // @ts-ignore
    const { src, alt = '', url = '', style = {} } = selectedImageNode
    $inputSrc.val(src)
    $inputAlt.val(alt)
    $inputUrl.val(url)
    // TODO 宽度 30% 50% 100%

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $(`#${srcInputId}`).focus()
    })

    return $content
  }

  private updateImage(
    editor: IDomEditor,
    src: string,
    alt: string = '',
    url: string = '',
    style: any = {}
  ) {
    if (!src) return

    // 还原选区
    DomEditor.restoreSelection(editor)

    if (this.isDisabled(editor)) return

    // 修改图片信息
    updateImageNode(editor, src, alt, url, style)
  }
}

export default EditImage
