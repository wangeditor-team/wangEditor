/**
 * @description 注册菜单 - modal menu
 * @author wangfupeng
 */

import { registerMenu, IModalMenu } from '../../../src/menus/index'
import { IDomEditor } from '../../../src/editor/interface'

class MyModalMenu implements IModalMenu {
  readonly title = 'My Modal Menu'
  readonly tag = 'button'
  readonly showModal = true
  readonly modalWidth = 300
  getValue(editor: IDomEditor) {
    return ''
  }
  isActive(editor: IDomEditor) {
    return false
  }
  isDisabled(editor: IDomEditor) {
    return false
  }
  exec(editor: IDomEditor, value: string | boolean) {
    console.log('do..')
  }
  getModalContentElem(editor: IDomEditor) {
    return document.createElement('div')
  }
  getModalPositionNode(editor: IDomEditor) {
    return null
  }
}

registerMenu({
  key: 'myModalMenu',
  factory() {
    return new MyModalMenu()
  },
})
