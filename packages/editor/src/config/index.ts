/**
 * @description 获取编辑器默认配置
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import { genToolbarKeys } from './toolbar'
import { genHoverbarKeys } from './hoverbar'

export function getDefaultEditorConfig() {
  return {
    // hover bar
    hoverbarKeys: genHoverbarKeys(),

    onChange(editor: IDomEditor) {
      // console.log('selection', editor.selection, editor.children)
      // console.log('getHtml--------\n', editor.getHtml())
      // console.log('getText--------\n', editor.getText())
    },

    // decorate: codeHighLightDecorate,
  }
}

export function genDefaultToolbarConfig() {
  return {
    toolbarKeys: genToolbarKeys(),
  }
}
