/**
 * @description justify center menu
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_CENTER_SVG } from '../../../constants/icon-svg'

class JustifyCenterMenu extends BaseMenu {
  title = '居中对齐'
  iconSvg = JUSTIFY_CENTER_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        textAlign: 'center',
      },
      { match: n => Element.isElement(n) }
    )
  }
}

export default JustifyCenterMenu
