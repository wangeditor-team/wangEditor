/**
 * @description button menu base
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { getHeaderType, isMenuDisabled, setHeaderType } from '../helper'

abstract class HeaderButtonMenuBase implements IButtonMenu {
  abstract readonly title: string
  abstract readonly type: string // 'header1' 'header2' 等
  readonly tag = 'button'

  /**
   * 获取选中节点的 node.type
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    return getHeaderType(editor)
  }

  isActive(editor: IDomEditor): boolean {
    return this.getValue(editor) === this.type
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor)
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const { type } = this
    let newType
    if (value === type) {
      // 选中的 node.type 和当前 type 一样，则取消
      newType = 'paragraph'
    } else {
      // 否则，则设置
      newType = type
    }

    setHeaderType(editor, newType)
  }
}

export default HeaderButtonMenuBase
