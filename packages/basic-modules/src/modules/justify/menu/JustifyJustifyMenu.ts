/**
 * @description 两端对齐
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_JUSTIFY_SVG } from '../../../constants/icon-svg'

class JustifyJustifyMenu extends BaseMenu {
  readonly title = '两端对齐'
  readonly iconSvg = JUSTIFY_JUSTIFY_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        textAlign: 'justify',
      },
      { match: n => Element.isElement(n) }
    )
  }
}

export default JustifyJustifyMenu
