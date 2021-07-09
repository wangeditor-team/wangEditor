/**
 * @description slate 插件 - dom 相关
 * @author wangfupeng
 */

import { Editor, Path, Operation, Transforms } from 'slate'
import { DomEditor } from '../dom-editor'
import { IDomEditor } from '../..'
import $ from '../../utils/dom'
import { Key } from '../../utils/key'
import {
  NODE_TO_KEY,
  IS_FOCUSED,
  EDITOR_TO_PANEL_AND_MODAL,
  EDITOR_TO_TEXTAREA,
  TEXTAREA_TO_EDITOR,
  EDITOR_TO_TOOLBAR,
  TOOLBAR_TO_EDITOR,
  EDITOR_TO_HOVER_BAR,
  HOVER_BAR_TO_EDITOR,
} from '../../utils/weak-maps'

let ID = 1

/**
 * `withDOM` adds DOM specific behaviors to the editor.
 */
export const withDOM = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor
  const { apply } = e

  e.id = `wangEditor-${ID++}`

  // 重写 apply 方法
  // apply 方法非常重要，它最终执行 operation https://docs.slatejs.org/concepts/05-operations
  // operation 的接口定义参考 slate src/interfaces/operation.ts
  e.apply = (op: Operation) => {
    const matches: [Path, Key][] = []

    switch (op.type) {
      case 'insert_text':
      case 'remove_text':
      case 'set_node': {
        for (const [node, path] of Editor.levels(e, { at: op.path })) {
          // 在当前节点寻找
          const key = DomEditor.findKey(e, node)
          matches.push([path, key])
        }
        break
      }

      case 'insert_node':
      case 'remove_node':
      case 'merge_node':
      case 'split_node': {
        for (const [node, path] of Editor.levels(e, { at: Path.parent(op.path) })) {
          // 在父节点寻找
          const key = DomEditor.findKey(e, node)
          matches.push([path, key])
        }
        break
      }

      case 'move_node': {
        break
      }
    }

    // 执行原本的 apply - 重要！！！
    apply(op)

    // 绑定 node 和 key
    for (const [path, key] of matches) {
      const [node] = Editor.node(e, path)
      NODE_TO_KEY.set(node, key)
    }
  }

  // focus
  e.focus = (isEnd?: boolean) => {
    const el = DomEditor.toDOMNode(e, e)
    IS_FOCUSED.set(e, true)

    if (isEnd) {
      const end = Editor.end(e, [])
      Transforms.select(e, end)
    }

    if (window.document.activeElement !== el) {
      el.focus({ preventScroll: true })
    }
  }

  // isFocused
  e.isFocused = () => {
    return !!IS_FOCUSED.get(e)
  }

  // blur
  e.blur = () => {
    const el = DomEditor.toDOMNode(e, e)
    IS_FOCUSED.set(e, false)

    if (window.document.activeElement === el) {
      el.blur()
    }
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
    const { $progressBar } = DomEditor.getTextarea(e)
    $progressBar.css('width', `${progress}%`)

    // 进度 100% 之后，定时隐藏
    if (progress >= 100) {
      setTimeout(() => {
        $progressBar.hide()
        $progressBar.css('width', '0')
        $progressBar.show()
      }, 1000)
    }
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

  return e
}
