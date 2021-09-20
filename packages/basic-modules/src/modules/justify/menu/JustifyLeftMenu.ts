/**
 * @description justify left menu
 * @author wangfupeng
 */

import { Transforms, Element } from 'slate'
import { IDomEditor, t } from '@wangeditor/core'
import BaseMenu from './BaseMenu'
import { JUSTIFY_LEFT_SVG } from '../../../constants/icon-svg'

class JustifyLeftMenu extends BaseMenu {
  readonly title = t('justify.left')
  readonly iconSvg = JUSTIFY_LEFT_SVG

  exec(editor: IDomEditor, value: string | boolean): void {
    Transforms.setNodes(
      editor,
      {
        textAlign: 'left',
      },
      { match: n => Element.isElement(n) && !editor.isInline(n) }
    )
  }
}

export default JustifyLeftMenu
