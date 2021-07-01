/**
 * @description justify right menu
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_RIGHT_SVG } from '../../../constants/icon-svg'

class JustifyRightMenu extends BaseMenu {
  title = '右对齐'
  iconSvg = JUSTIFY_RIGHT_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        // @ts-ignore
        textAlign: 'right',
      },
      { match: n => Element.isElement(n) }
    )
  }
}

export default JustifyRightMenu
