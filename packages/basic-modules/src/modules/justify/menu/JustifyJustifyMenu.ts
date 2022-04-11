/**
 * @description 两端对齐
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor, t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_JUSTIFY_SVG } from '../../../constants/icon-svg'

class JustifyJustifyMenu extends BaseMenu {
  readonly title = t('justify.justify')
  readonly iconSvg = JUSTIFY_JUSTIFY_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        textAlign: 'justify',
      },
      { match: n => Element.isElement(n) && !editor.isInline(n) }
    )
  }
}

export default JustifyJustifyMenu
