/**
 * @description text-area class
 * @author wangfupeng
 */

import { Range } from 'slate'
import throttle from 'lodash.throttle'
import forEach from 'lodash.foreach'
import $, { Dom7Array, DOMElement } from '../utils/dom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'
import updateView from './update-view'
import { handlePlaceholder } from './place-holder'
import { editorSelectionToDOM, DOMSelectionToEditor } from './syncSelection'
import { promiseResolveThen } from '../utils/util'
import eventHandlerConf from './event-handlers/index'

let ID = 1

class TextArea {
  readonly id = ID++
  $box: Dom7Array
  $textAreaContainer: Dom7Array
  $scroll: Dom7Array
  $textArea: Dom7Array | null = null
  private readonly $progressBar = $('<div class="w-e-progress-bar"></div>')
  private readonly $maxLengthInfo = $('<div class="w-e-max-length-info"></div>')
  isComposing: boolean = false
  isUpdatingSelection: boolean = false
  isDraggingInternally: boolean = false
  latestElement: DOMElement | null = null
  showPlaceholder = false
  $placeholder: Dom7Array | null = null
  private latestEditorSelection: Range | null = null

  constructor(boxSelector: string | DOMElement) {
    // @ts-ignore 初始化 dom
    const $box = $(boxSelector)
    if ($box.length === 0) {
      throw new Error(`Cannot find textarea DOM by selector '${boxSelector}'`)
    }
    this.$box = $box
    const $container = $(`<div class="w-e-text-container"></div>`)
    $container.append(this.$progressBar) // 进度条
    $container.append(this.$maxLengthInfo) // max length 提示信息
    $box.append($container)
    const $scroll = $(`<div class="w-e-scroll"></div>`)
    $container.append($scroll)
    this.$scroll = $scroll
    this.$textAreaContainer = $container

    // 异步，否则获取不到 editor 和 DOM
    promiseResolveThen(() => {
      const editor = this.editorInstance
      const window = DomEditor.getWindow(editor)

      // 监听 selection change
      window.document.addEventListener('selectionchange', this.onDOMSelectionChange)
      // editor 销毁时，解绑 selection change
      editor.on('destroyed', () => {
        window.document.removeEventListener('selectionchange', this.onDOMSelectionChange)
      })

      // 点击编辑区域，关闭 panel
      $container.on('click', () => editor.hidePanelOrModal())

      // editor onchange 时更新视图
      editor.on('change', this.changeViewState.bind(this))

      // editor onchange 时触发用户配置的 onChange （需要在 changeViewState 后执行）
      const { onChange } = editor.getConfig()
      if (onChange) {
        editor.on('change', () => onChange(editor))
      }

      // 监听 onfocus onblur
      this.onFocusAndOnBlur()

      // 实时修改 maxLength 提示信息
      editor.on('change', this.changeMaxLengthInfo.bind(this))

      // 绑定 DOM 事件
      this.bindEvent()
    })
  }

  private get editorInstance(): IDomEditor {
    const editor = TEXTAREA_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
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
    const { scroll } = editor.getConfig()
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
        // 异步触发 focus
        setTimeout(() => onFocus && onFocus(editor))
      } else if (this.latestEditorSelection != null && editor.selection == null) {
        // 异步触发 blur
        setTimeout(() => onBlur && onBlur(editor))
      }

      this.latestEditorSelection = editor.selection // 重新记录 selection
    })
  }

  /**
   * 修改 maxLength 提示信息
   */
  private changeMaxLengthInfo() {
    const editor = this.editorInstance
    const { maxLength } = editor.getConfig()
    if (maxLength) {
      const leftLength = DomEditor.getLeftLengthOfMaxLength(editor)
      const curLength = maxLength - leftLength
      this.$maxLengthInfo[0].innerHTML = `${curLength}/${maxLength}`
    }
  }

  /**
   * 修改进度条
   * @param progress 进度
   */
  changeProgress(progress: number) {
    const $progressBar = this.$progressBar
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

  /**
   * 修改 view 状态
   */
  changeViewState() {
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
