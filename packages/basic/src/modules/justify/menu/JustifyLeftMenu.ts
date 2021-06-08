/**
 * @description justify left menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_LEFT_SVG } from '../../_helpers/icon-svg'

class JustifyLeftMenu extends BaseMenu {
  title = '左对齐'
  iconSvg = JUSTIFY_LEFT_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        textAlign: 'left',
      },
      { mode: 'highest' }
    )
  }
}

export default JustifyLeftMenu
