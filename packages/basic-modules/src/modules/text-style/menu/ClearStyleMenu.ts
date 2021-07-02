/**
 * @description clear style menu
 * @author wangfupeng
 */

import { Editor, Text } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { ERASER_SVG } from '../../../constants/icon-svg'
import { isMenuDisabled } from '../helper'

class ClearStyleMenu implements IButtonMenu {
  readonly title = '清除格式'
  readonly iconSvg = ERASER_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor)
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value 是否有 mark
   */
  exec(editor: IDomEditor, value: string | boolean) {
    // 获取所有 text node
    const nodeEntries = Editor.nodes(editor, {
      match: n => Text.isText(n),
    })
    for (const nodeEntry of nodeEntries) {
      // 单个 text node
      const n = nodeEntry[0]
      // 遍历 text node 属性，清除样式
      const keys = Object.keys(n as object)
      keys.forEach(key => {
        if (key === 'text') {
          // 保留 text 属性，text node 必须的
          return
        }
        // 其他属性，全部清除
        Editor.removeMark(editor, key)
      })
    }
  }
}

export default ClearStyleMenu
