/**
 * @description update link menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IModalMenu, IDomEditor, DomEditor, hideAllPanelsAndModals } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'
import { genRandomStr } from '../../../utils/util'
import { getInputElems, getButtonElems, getLinkNode, checkLink } from './helpers'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-update-link')
}

class UpdateLink implements IModalMenu {
  title = '修改链接'
  iconSvg =
    '<svg viewBox="0 0 1024 1024"><path d="M850.622159 29.124904c-31.331849-33.126756-82.334296-33.126756-113.660501 0L672.525631 97.602293l151.494653 160.582075 64.441672-68.454812c31.676155-33.143689 31.676155-87.019116 0-120.168449l-37.839797-40.436203z m-208.683321 100.514783l-421.684577 447.919568V587.01356h36.411774v36.417418h36.417418v36.417418h36.417418v36.411774h36.411774V748.318113l427.882085-458.090707-151.855892-160.587719zM183.836843 616.516635l-15.663103 16.379936-57.166089 219.238276 223.21755-69.555462 12.378084-13.484379h-17.102414v-36.411774h-36.417418v-36.417418h-36.417418v-36.411774h-36.411774v-36.417418H183.836843v-6.919987z m-43.704289 338.672958v68.810407h758.528762v-68.810407H140.132554z"></path></svg>'
  tag = 'button'
  showModal = true // 点击 button 时显示 modal
  private $content: Dom7Array | null = null
  private urlInputId = genDomID()
  private buttonId = genDomID()

  /**
   * 获取 node.url
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const linkNode = getLinkNode(editor)
    if (linkNode) {
      // @ts-ignore
      return linkNode.url || ''
    }
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const url = this.getValue(editor)
    return !!url
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const linkNode = getLinkNode(editor)

    // 未匹配到 link node 则禁用
    if (linkNode == null) return true
    return false
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { urlInputId, buttonId } = this

    // 获取 input button elem
    const [$urlContainer, $inputUrl] = getInputElems('链接网址', urlInputId)
    const [$buttonContainer] = getButtonElems(buttonId, '确定')

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div style="width: 300px;"></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', 'button', e => {
        e.preventDefault()
        const url = $(`#${urlInputId}`).val()
        this.updateLink(editor, url)
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append input and button
    $content.append($urlContainer)
    $content.append($buttonContainer)

    // 设置 input val
    const url = this.getValue(editor)
    $inputUrl.val(url)

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $(`#${urlInputId}`).focus()
    })

    return $content
  }

  /**
   * 修改 link
   * @param editor editor
   * @param url url
   */
  private updateLink(editor: IDomEditor, url: string) {
    if (!url) {
      hideAllPanelsAndModals() // 隐藏 modal
      return
    }

    // 还原选区
    DomEditor.restoreSelection(editor)

    if (this.isDisabled(editor)) return

    // 修改链接
    Transforms.setNodes(
      editor,
      // @ts-ignore
      { url },
      {
        match: checkLink,
      }
    )

    // 隐藏 modal
    hideAllPanelsAndModals()
  }
}

export default UpdateLink
