/**
 * @description justify right menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_RIGHT_SVG } from '../../_helpers/icon-svg'

class JustifyRightMenu extends BaseMenu {
  title = '右对齐'
  iconSvg = JUSTIFY_RIGHT_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(editor, {
      // @ts-ignore
      textAlign: 'right',
    })
  }
}

export default JustifyRightMenu
