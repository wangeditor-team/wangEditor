/**
 * @description text-area class
 * @author wangfupeng
 */

import { Range } from 'slate'
import { throttle, forEach } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_CONFIG } from '../utils/weak-maps'
import { IDomEditor } from '../editor/interface'
import updateView from './update-view'
import handlePlaceholder from './place-holder'
import { DOMElement } from '../utils/dom'
import { editorSelectionToDOM, DOMSelectionToEditor } from './syncSelection'
import { promiseResolveThen } from '../utils/util'
import eventHandlerConf from './event-handlers/index'
import { IEditorConfig } from '../config/interface'

let ID = 1

class TextArea {
  readonly id = ID++
  $textAreaContainer: Dom7Array
  $scroll: Dom7Array
  $textArea: Dom7Array | null = null
  readonly $progressBar = $('<div class="w-e-progress-bar"></div>')
  isComposing: boolean = false
  isUpdatingSelection: boolean = false
  latestElement: DOMElement | null = null
  showPlaceholder = false
  $placeholder: Dom7Array | null = null
  private latestEditorSelection: Range | null = null

  constructor(selector: string) {
    // 初始化 dom
    const $box = $(selector)
    if ($box.length === 0) {
      throw new Error(`Cannot find textarea DOM by selector '${selector}'`)
    }
    const $container = $(`<div class="w-e-text-container"></div>`)
    $container.append(this.$progressBar) // 进度条
    $box.append($container)
    const $scroll = $(`<div class="w-e-scroll"></div>`)
    $container.append($scroll)
    this.$scroll = $scroll
    this.$textAreaContainer = $container

    // 监听 selection change
    window.document.addEventListener('selectionchange', this.onDOMSelectionChange)

    // 异步，否则获取不到 editor 和 DOM
    promiseResolveThen(() => {
      const editor = this.editorInstance

      // 监听 editor onchange
      editor.on('change', this.onEditorChange.bind(this))

      // editor 销毁时，解绑 selection change
      editor.on('destroyed', () => {
        window.document.removeEventListener('selectionchange', this.onDOMSelectionChange)
      })

      // 监听 onfocus onblur
      this.onFocusAndOnBlur()

      // 绑定 DOM 事件
      this.bindEvent()
    })
  }

  private get editorInstance(): IDomEditor {
    const editor = TEXTAREA_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  public get editorConfig(): IEditorConfig {
    const editor = this.editorInstance
    const config = EDITOR_TO_CONFIG.get(editor)
    if (config == null) throw new Error('Can not get editor config')
    return config
  }

  private onDOMSelectionChange = throttle(() => {
    const editor = this.editorInstance
    DOMSelectionToEditor(this, editor)
  }, 100)

  /**
   * 绑定事件，如 beforeinput onblur onfocus keydown click copy/paste drag/drop 等
   */
  private bindEvent() {
    const { $textArea, $scroll } = this
    const editor = this.editorInstance

    if ($textArea == null) return

    // 遍历所有事件类型，绑定
    forEach(eventHandlerConf, (fn, eventType) => {
      $textArea.on(eventType, event => {
        fn(event, this, editor)
      })
    })

    // 设置 scroll
    const { scroll } = this.editorConfig
    if (scroll) {
      $scroll.css('overflow-y', 'auto')
      // scroll 自定义事件
      $scroll.on(
        'scroll',
        throttle(() => {
          editor.emit('scroll')
        }, 100)
      )
    }
  }

  private onFocusAndOnBlur() {
    const editor = this.editorInstance
    const { onBlur, onFocus } = editor.getConfig()
    this.latestEditorSelection = editor.selection

    editor.on('change', () => {
      if (this.latestEditorSelection == null && editor.selection != null) {
        // 需要触发 focus
        onFocus && onFocus(editor)
      } else if (this.latestEditorSelection != null && editor.selection == null) {
        // 需要触发 blur
        onBlur && onBlur(editor)
      }

      this.latestEditorSelection = editor.selection // 重新记录 selection
    })
  }

  /**
   * editor.onchange 时触发
   */
  onEditorChange() {
    const editor = this.editorInstance

    // 更新 DOM
    // TODO 注意这里是否会有性能瓶颈？因为每次键盘输入，都会触发这里 —— 可单独测试大文件、多内容，如几万个字
    updateView(this, editor)

    // 处理 placeholder
    handlePlaceholder(this, editor)

    // 同步选区（异步，否则拿不到 DOM 渲染结果，vdom）
    promiseResolveThen(() => {
      editorSelectionToDOM(this, editor)
    })
  }

  /**
   * 销毁 textarea
   */
  destroy() {
    // 销毁 DOM （只销毁最外层 DOM 即可）
    this.$textAreaContainer.remove()
  }
}

export default TextArea
