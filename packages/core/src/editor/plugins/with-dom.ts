/**
 * @description slate 插件 - dom 相关
 * @author wangfupeng
 */

import { Node, Editor, Transforms } from 'slate'
import { DomEditor } from '../dom-editor'
import { IDomEditor } from '../..'
import $, { Dom7Array } from '../../utils/dom'
import {
  IS_FOCUSED,
  EDITOR_TO_PANEL_AND_MODAL,
  EDITOR_TO_TEXTAREA,
  TEXTAREA_TO_EDITOR,
  EDITOR_TO_TOOLBAR,
  TOOLBAR_TO_EDITOR,
  EDITOR_TO_HOVER_BAR,
  HOVER_BAR_TO_EDITOR,
  EDITOR_TO_SELECTION,
} from '../../utils/weak-maps'

let ID = 1

/**
 * `withDOM` adds DOM specific behaviors to the editor.
 */
export const withDOM = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor

  e.id = `wangEditor-${ID++}`

  e.isDestroyed = false

  e.isFullScreen = false

  // focus
  e.focus = (isEnd?: boolean) => {
    const el = DomEditor.toDOMNode(e, e)
    el.focus({ preventScroll: true })

    IS_FOCUSED.set(e, true)

    // 恢复选区
    if (isEnd) {
      // 选区定位到结尾
      const end = Editor.end(e, [])
      Transforms.select(e, end)
    } else {
      const selection = EDITOR_TO_SELECTION.get(e)
      if (selection) {
        Transforms.select(e, selection) // 选区定位到之前的位置
      } else {
        Transforms.select(e, Editor.start(e, [])) // 选区定位到开始
      }
    }
  }

  // isFocused
  e.isFocused = () => {
    return !!IS_FOCUSED.get(e)
  }

  // blur
  e.blur = () => {
    const el = DomEditor.toDOMNode(e, e)
    el.blur()

    // 手动执行一次光标 deselect, 触发 onchange 回调，改变 Toolbar 的状态
    Transforms.deselect(e)

    IS_FOCUSED.set(e, false)
  }

  // 手动更新试图
  e.updateView = () => {
    const textarea = DomEditor.getTextarea(e)
    textarea.changeViewState()

    const toolbar = DomEditor.getToolbar(e)
    toolbar && toolbar.changeToolbarState()

    const hoverbar = DomEditor.getHoverbar(e)
    hoverbar && hoverbar.changeHoverbarState()
  }

  // destroy
  e.destroy = () => {
    // 销毁相关实例（会销毁 DOM）
    if (e.isDestroyed) return
    // fix https://github.com/wangeditor-team/wangEditor-v5/issues/457
    const textarea = DomEditor.getTextarea(e)
    textarea.destroy()
    EDITOR_TO_TEXTAREA.delete(e)
    TEXTAREA_TO_EDITOR.delete(textarea)

    const toolbar = DomEditor.getToolbar(e)
    if (toolbar) {
      toolbar.destroy()
      EDITOR_TO_TOOLBAR.delete(e)
      TOOLBAR_TO_EDITOR.delete(toolbar)
    }

    const hoverbar = DomEditor.getHoverbar(e)
    if (hoverbar) {
      hoverbar.destroy()
      EDITOR_TO_HOVER_BAR.delete(e)
      HOVER_BAR_TO_EDITOR.delete(hoverbar)
    }

    // 修改属性
    e.isDestroyed = true

    // 触发自定义事件
    e.emit('destroyed')
  }

  // scroll to elem
  e.scrollToElem = (id: string) => {
    const { scroll } = e.getConfig()
    if (!scroll) {
      // 没有设置编辑区域滚动，则不能用
      let info = '编辑器禁用了 scroll ，编辑器内容无法滚动，请自行实现该功能'
      info += '\nYou has disabled editor scroll, please do this yourself'
      console.warn(info)
      return
    }

    const $elem = $(`#${id}`)
    if ($elem.length === 0) return

    // $elem 不在 editor DOM 范围之内
    const elem = $elem[0]
    if (!DomEditor.hasDOMNode(e, elem)) {
      let info = `Element (found by id is '${id}') is not in editor DOM`
      info += `\n 通过 id '${id}' 找到的 element 不在 editor DOM 之内`
      console.error(info, elem)
      return
    }

    const textarea = DomEditor.getTextarea(e)
    const { $textAreaContainer, $scroll } = textarea

    const { top: elemTop } = $elem.offset()
    const { top: containerTop } = $textAreaContainer.offset()

    // 滚动到指定元素
    $scroll[0].scrollBy({ top: elemTop - containerTop, behavior: 'smooth' })
  }

  // showProgressBar
  e.showProgressBar = (progress: number) => {
    // progress 值范围： 0 - 100
    if (progress < 1) return

    // 显示进度条
    const textarea = DomEditor.getTextarea(e)
    textarea.changeProgress(progress)
  }

  // 隐藏 panel 或 modal
  e.hidePanelOrModal = () => {
    const set = EDITOR_TO_PANEL_AND_MODAL.get(e)
    if (set == null) return
    set.forEach(panelOrModal => panelOrModal.hide())
  }

  e.enable = () => {
    const config = e.getConfig()
    config.readOnly = false

    // 更新视图
    e.updateView()
  }

  e.disable = () => {
    const config = e.getConfig()
    config.readOnly = true

    // 更新视图
    e.updateView()
  }

  e.isDisabled = () => {
    const config = e.getConfig()
    return config.readOnly
  }

  e.toDOMNode = (node: Node) => {
    return DomEditor.toDOMNode(e, node)
  }

  e.fullScreen = () => {
    if (e.isFullScreen) return

    let $toolbarBox: Dom7Array | null = null
    const toolbar = DomEditor.getToolbar(e)
    if (toolbar) {
      $toolbarBox = toolbar.$box
    }

    const textarea = DomEditor.getTextarea(e)
    const $textAreaBox = textarea.$box
    const $parent = $textAreaBox.parent()

    if ($toolbarBox && $toolbarBox.parent()[0] !== $parent[0]) {
      // toolbar DOM 父节点，和 editor DOM 父节点不一致，则不能设置全屏
      let info =
        'Can not set full screen, cause toolbar DOM parent is not equal to textarea DOM parent'
      info += '\n不能设置全屏，因为 toolbar DOM 父节点和 textarea DOM 父节点不一致'
      throw new Error(info)
    }

    // 设置全屏
    $parent.addClass('w-e-full-screen-container')

    // 设置 z-index
    const curZIndex = $parent.css('z-index')
    $parent.attr('data-z-index', curZIndex.toString())

    // 记录属性
    e.isFullScreen = true

    // 触发自定义事件
    e.emit('fullScreen')
  }

  e.unFullScreen = () => {
    if (!e.isFullScreen) return

    const textarea = DomEditor.getTextarea(e)
    const $textAreaBox = textarea.$box
    const $parent = $textAreaBox.parent()

    // 解决#issue175, 编辑器取消全屏 - element dialog组件会被隐藏
    setTimeout(() => {
      // 取消全屏
      $parent.removeClass('w-e-full-screen-container')

      // 记录属性
      e.isFullScreen = false

      // 触发自定义事件
      e.emit('unFullScreen')
    }, 200)
  }

  /**
   * 获取编辑区域 DOM 容器
   */
  e.getEditableContainer = () => {
    const textarea = DomEditor.getTextarea(e)
    return textarea.$textAreaContainer[0]
  }

  return e
}
