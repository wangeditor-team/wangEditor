/**
 * @description slate 插件，重写部分 API（参考 slate-react with-react.ts ）
 * @author wangfupeng
 */

import { Editor, Node, Path, Operation, Transforms, Range, Text } from 'slate'
import { DomEditor } from '../dom-editor'
import { IDomEditor } from '../..'
import {
  NODE_TO_KEY,
  EDITOR_TO_CONFIG,
  EDITOR_TO_SELECTION,
  IS_FOCUSED,
  EDITOR_TO_PANEL_AND_MODAL,
} from '../../utils/weak-maps'
import { Key } from '../../utils/key'
import { isDOMText, getPlainText } from '../../utils/dom'
import { IConfig, AlertType } from '../../config/interface'
import { node2html } from '../../to-html/node2html'
import { genElemId } from '../../formats/helper'
import $ from '../../utils/dom'
import { MENU_ITEM_FACTORIES } from '../../menus/register'

let ID = 1

/**
 * `withDOM` adds DOM specific behaviors to the editor.
 */
export const withDOM = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor
  const { apply, onChange, insertText } = e

  e.id = `wangEditorCore-${ID++}`

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

  e.setFragmentData = (data: DataTransfer) => {
    const { selection } = e

    if (!selection) {
      return
    }

    // 获取开始、结束两个 point { path, offset }
    const [start, end] = Range.edges(selection)
    // Editor.void - Match a void node in the current branch of the editor.
    const startVoid = Editor.void(e, { at: start.path })
    const endVoid = Editor.void(e, { at: end.path })

    if (Range.isCollapsed(selection) && !startVoid) {
      return
    }

    // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.
    const domRange = DomEditor.toDOMRange(e, selection)
    let contents = domRange.cloneContents()
    let attach = contents.childNodes[0] as HTMLElement

    // Make sure attach is non-empty, since empty nodes will not get copied.
    contents.childNodes.forEach(node => {
      if (node.textContent && node.textContent.trim() !== '') {
        attach = node as HTMLElement
      }
    })

    // COMPAT: If the end node is a void node, we need to move the end of the
    // range from the void node's spacer span, to the end of the void node's
    // content, since the spacer is before void's content in the DOM.
    if (endVoid) {
      const [voidNode] = endVoid
      const r = domRange.cloneRange()
      const domNode = DomEditor.toDOMNode(e, voidNode)
      r.setEndAfter(domNode)
      contents = r.cloneContents()
    }

    // COMPAT: If the start node is a void node, we need to attach the encoded
    // fragment to the void node's content node instead of the spacer, because
    // attaching it to empty `<div>/<span>` nodes will end up having it erased by
    // most browsers. (2018/04/27)
    if (startVoid) {
      attach = contents.querySelector('[data-slate-spacer]')! as HTMLElement
    }

    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.
    Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(zw => {
      const isNewline = zw.getAttribute('data-slate-zero-width') === 'n'
      zw.textContent = isNewline ? '\n' : ''
    })

    // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.
    if (isDOMText(attach)) {
      const span = document.createElement('span')
      // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
      // then leading and trailing spaces will be ignored. (2017/09/21)
      span.style.whiteSpace = 'pre'
      span.appendChild(attach)
      contents.appendChild(span)
      attach = span
    }

    const fragment = e.getFragment()
    const string = JSON.stringify(fragment)
    const encoded = window.btoa(encodeURIComponent(string))
    attach.setAttribute('data-slate-fragment', encoded)
    data.setData('application/x-slate-fragment', encoded)

    // Add the content to a <div> so that we can get its inner HTML.
    const div = document.createElement('div')
    div.appendChild(contents)
    div.setAttribute('hidden', 'true')
    document.body.appendChild(div)
    data.setData('text/html', div.innerHTML)
    data.setData('text/plain', getPlainText(div))
    document.body.removeChild(div)
  }

  e.insertData = (data: DataTransfer) => {
    const fragment = data.getData('application/x-slate-fragment')
    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment))
      const parsed = JSON.parse(decoded) as Node[]
      e.insertFragment(parsed)
      return
    }

    const text = data.getData('text/plain')
    // const html = data.getData('text/html')

    if (text) {
      const lines = text.split(/\r\n|\r|\n/)
      let split = false

      for (const line of lines) {
        if (split) {
          Transforms.splitNodes(e, { always: true })
        }

        e.insertText(line)
        split = true
      }
    }
  }

  e.insertText = (s: string) => {
    // maxLength
    const { maxLength, onMaxLength } = e.getConfig()
    if (typeof maxLength === 'number' && maxLength > 0) {
      const editorText = e.getText()
      if (editorText.length >= maxLength) {
        // 触发 maxLength 限制，不再继续插入文字
        if (onMaxLength) onMaxLength(e)
        return
      }
    }

    // 执行默认的 insertText
    insertText(s)
  }

  e.getAllMenuKeys = (): string[] => {
    const arr = []
    for (let key in MENU_ITEM_FACTORIES) {
      arr.push(key)
    }
    return arr
  }

  // 获取 editor 配置信息
  e.getConfig = (): IConfig => {
    const config = EDITOR_TO_CONFIG.get(e)
    if (config == null) throw new Error('Can not get editor config')
    return config
  }

  // 获取 menu config
  e.getMenuConfig = (menuKey: string): { [key: string]: any } => {
    const { menuConf = {} } = e.getConfig()
    return menuConf[menuKey] || {}
  }

  // 修改配置
  e.setConfig = (newConfig: Partial<IConfig>) => {
    const curConfig = e.getConfig()
    EDITOR_TO_CONFIG.set(e, {
      ...curConfig,
      ...newConfig,
    })
  }

  // 重写 onchange API
  e.onChange = () => {
    // 记录当前选区
    const { selection } = e
    if (selection != null) {
      EDITOR_TO_SELECTION.set(e, selection)
    }

    // 触发配置的 change 事件
    e.emit('change')

    onChange()
  }

  // tab
  e.handleTab = () => {
    e.insertText('    ')
  }

  // 获取 html
  e.getHtml = (): string => {
    const { children = [] } = e
    return children.map(child => node2html(child, e)).join('\n')
  }

  // 获取 text
  e.getText = (): string => {
    const { children = [] } = e
    return children.map(child => Node.string(child)).join('\n')
  }

  // 获取选区文字
  e.getSelectionText = (): string => {
    const { selection } = e
    if (selection == null) return ''
    return Editor.string(editor, selection)
  }

  // 获取所有标题
  e.getHeaders = () => {
    const headers: { id: string; type: string; text: string }[] = []
    const { children = [] } = e
    children.forEach(n => {
      if (Text.isText(n)) return

      const { type = '' } = n
      if (type.startsWith('header')) {
        const key = DomEditor.findKey(e, n)
        const id = genElemId(key.id)
        const text = Node.string(n)

        headers.push({ id, type, text })
      }
    })
    return headers
  }

  // focus
  e.focus = () => {
    const el = DomEditor.toDOMNode(e, e)
    IS_FOCUSED.set(e, true)

    if (window.document.activeElement !== el) {
      el.focus({ preventScroll: true })
    }
  }

  // blur
  e.blur = () => {
    const el = DomEditor.toDOMNode(e, e)
    IS_FOCUSED.set(e, false)

    if (window.document.activeElement === el) {
      el.blur()
    }
  }

  // alert
  e.alert = (info: string, type?: AlertType) => {
    const { alert } = e.getConfig()
    if (alert) alert(info, type)
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
  // TODO 一个页面多编辑器时，测试是否有影响。即 A 只关闭 A 的，B 只关闭 B 的，不要相互影响
  e.hidePanelOrModal = () => {
    const set = EDITOR_TO_PANEL_AND_MODAL.get(e)
    if (set == null) return
    set.forEach(panelOrModal => panelOrModal.hide())
  }

  // 最后要返回 editor 实例 - 重要！！！
  return e
}
