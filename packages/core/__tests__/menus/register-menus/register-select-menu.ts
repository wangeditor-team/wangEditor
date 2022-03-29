/**
 * @description 注册菜单 - select menu
 * @author wangfupeng
 */

import { registerMenu, ISelectMenu, IOption } from '../../../src/menus/index'
import { IDomEditor } from '../../../src/editor/interface'

class MySelectMenu implements ISelectMenu {
  readonly title = 'My Select Menu'
  readonly tag = 'select'
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
  getOptions(): IOption[] {
    return [
      { value: 'a', text: 'a' },
      { value: 'b', text: 'b' },
    ]
  }
}

registerMenu({
  key: 'mySelectMenu',
  factory() {
    return new MySelectMenu()
  },
})
