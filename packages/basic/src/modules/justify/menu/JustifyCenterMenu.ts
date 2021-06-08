/**
 * @description justify center menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_CENTER_SVG } from '../../_helpers/icon-svg'

class JustifyCenterMenu extends BaseMenu {
  title = '居中对齐'
  iconSvg = JUSTIFY_CENTER_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        textAlign: 'center',
      },
      { mode: 'highest' }
    )
  }
}

export default JustifyCenterMenu
