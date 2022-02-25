/**
 * @description insert video menu
 * @author wangfupeng
 */

import { Range, Node } from 'slate'
import {
  IModalMenu,
  IDomEditor,
  DomEditor,
  genModalInputElems,
  genModalButtonElems,
  t,
} from '@wangeditor/core'
import $, { Dom7Array, DOMElement } from '../../utils/dom'
import { genRandomStr } from '../../utils/util'
import { VIDEO_SVG } from '../../constants/svg'
import insertVideo from '../helper/insert-video'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-video')
}

class InsertVideoMenu implements IModalMenu {
  readonly title = t('videoModule.insertVideo')
  readonly iconSvg = VIDEO_SVG
  readonly tag = 'button'
  readonly showModal = true // 点击 button 时显示 modal
  readonly modalWidth = 320
  private $content: Dom7Array | null = null
  private readonly srcInputId = genDomID()
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
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    const selectedElems = DomEditor.getSelectedElems(editor)
    const hasVoidOrPre = selectedElems.some(elem => {
      const type = DomEditor.getNodeType(elem)
      if (type === 'pre') return true
      if (editor.isVoid(elem)) return true
      return false
    })
    if (hasVoidOrPre) return true // void 或 pre ，禁用

    return false
  }

  getModalPositionNode(editor: IDomEditor): Node | null {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor: IDomEditor): DOMElement {
    const { srcInputId, buttonId } = this

    // 获取 input button elem
    const [srcContainerElem, inputSrcElem] = genModalInputElems(
      t('videoModule.videoSrc'),
      srcInputId,
      t('videoModule.insertPlaceHolder')
    )
    const $inputSrc = $(inputSrcElem)
    const [buttonContainerElem] = genModalButtonElems(buttonId, t('videoModule.ok'))

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, async e => {
        e.preventDefault()
        const src = $content.find(`#${srcInputId}`).val().trim()
        await insertVideo(editor, src)
        editor.hidePanelOrModal() // 隐藏 modal
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append inputs and button
    $content.append(srcContainerElem)
    $content.append(buttonContainerElem)

    // 设置 input val
    $inputSrc.val('')

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $inputSrc.focus()
    })

    return $content[0]
  }
}

export default InsertVideoMenu
