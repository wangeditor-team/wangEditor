/**
 * @description text-area class
 * @author wangfupeng
 */

import { throttle, forEach } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_CONFIG } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'
import updateView from './updateView'
import { DOMElement } from '../utils/dom'
import { editorSelectionToDOM, DOMSelectionToEditor } from './syncSelection'
import { promiseResolveThen } from '../utils/util'
import eventHandlerConf from './event-handlers/index'
import { IConfig } from '../config/index'

let ID = 1

class TextArea {
  id: number
  $textAreaContainer: Dom7Array
  $textArea: Dom7Array | null = null
  isComposing: boolean = false
  isUpdatingSelection: boolean = false
  latestElement: DOMElement | null = null

  constructor(textAreaContainerId: string) {
    // id 不能重复
    this.id = ID++

    // 初始化 dom
    const $textAreaContainer = $(`#${textAreaContainerId}`)
    this.$textAreaContainer = $textAreaContainer

    // 监听 selection change
    window.document.addEventListener('selectionchange', this.onDOMSelectionChange)
    // TODO editor 销毁时，解绑事件

    // 绑定事件 - 异步，否则获取不到 DOM 节点
    promiseResolveThen(this.bindEvent.bind(this))
  }

  private get editorInstance(): IDomEditor {
    const editor = TEXTAREA_TO_EDITOR.get(this)
    if (editor == null) throw new Error('Can not get editor instance')
    return editor
  }

  public get editorConfig(): IConfig {
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
    const $textArea = this.$textArea
    const editor = this.editorInstance

    if ($textArea == null) return

    // 遍历所有事件类型，绑定
    forEach(eventHandlerConf, (fn, eventType) => {
      $textArea.on(eventType, event => {
        // @ts-ignore 忽略 event 类型的语法提示
        fn(event, this, editor)
      })
      // TODO editor 销毁时，解绑事件
    })
  }

  /**
   * editor.onchange 时触发
   * 【注意】如果频繁触发，会导致 DOM 频繁更新（diff patch 没有 React 那么强大），但加*节流*又怕丢失 beforeInput 的 insertText ？？？
   * 感觉这里还是要考虑节流的，考虑一种方式缓存 insertText 数据 ？？？
   */
  onEditorChange() {
    const editor = this.editorInstance

    // 更新 DOM
    updateView(this, editor)

    // 同步选区（异步，否则拿不到 DOM 渲染结果，vdom）
    promiseResolveThen(() => {
      editorSelectionToDOM(this, editor)
    })
  }
}

export default TextArea
