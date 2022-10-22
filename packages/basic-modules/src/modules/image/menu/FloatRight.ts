/**
 * @description image width 30%
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import ImageFloatBaseClass from './FloatBase'
import { RIGHT_FLOAT_SVG } from '../../../constants/icon-svg'

class FloatRight extends ImageFloatBaseClass {
  readonly title = t('float.right') // 菜单标题
  readonly value = 'right' // css float 的值
  readonly iconSvg = RIGHT_FLOAT_SVG
}

export default FloatRight
