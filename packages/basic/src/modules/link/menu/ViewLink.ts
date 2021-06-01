/**
 * @description view link menu
 * @author wangfupeng
 */

import { IMenuItem, IDomEditor } from '@wangeditor/core'
import { getLinkNode } from './helpers'

class ViewLink implements IMenuItem {
  title = '查看链接'
  iconSvg =
    '<svg viewBox="0 0 1024 1024"><path d="M924.402464 1023.068211H0.679665V99.345412h461.861399v98.909208H99.596867v725.896389h725.896389V561.206811h98.909208z" p-id="10909"></path><path d="M930.805104 22.977336l69.965436 69.965436-453.492405 453.492404-69.965435-69.901489z" p-id="10910"></path><path d="M1022.464381 304.030081h-98.917201V99.345412H709.230573V0.428211h313.233808z"></path></svg>'
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    const linkNode = getLinkNode(editor)
    if (linkNode) {
      // @ts-ignore 选区处于 link node
      return linkNode.url || ''
    }
    return ''
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const linkNode = getLinkNode(editor)
    if (linkNode == null) {
      // 选区未处于 link node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    if (!value || typeof value !== 'string') {
      throw new Error(`View link failed, link url is '${value}'`)
      return
    }

    // 查看链接
    window.open(value, '_blank')
  }
}

export default {
  key: 'viewLink',
  factory() {
    return new ViewLink()
  },
}
