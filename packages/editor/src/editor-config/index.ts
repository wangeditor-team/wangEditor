/**
 * @description 获取编辑器默认配置
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import { genToolbarKeys } from './toolbar'
import { genHoverbarKeys } from './hoverbar'

function getDefaultEditorConfig() {
  return {
    // 传统菜单栏
    toolbarKeys: genToolbarKeys(),

    // hover bar
    hoverbarKeys: genHoverbarKeys(),

    onChange(editorCore: IDomEditor) {
      // console.log('selection', editor.selection, editor.children)
      // console.log('getHtml--------\n', editor.getHtml())
      // console.log('getText--------\n', editor.getText())
    },

    // decorate: codeHighLightDecorate,
  }
}

export default getDefaultEditorConfig
