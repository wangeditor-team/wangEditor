/**
 * @description image width 30%
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import ImageFloatBaseClass from './FloatBase'
import { DEFAULT_FLOAT_SVG } from '../../../constants/icon-svg'

class FloatNone extends ImageFloatBaseClass {
  readonly title = t('float.none') // 菜单标题
  readonly value = 'none' // css float 的值
  readonly iconSvg = DEFAULT_FLOAT_SVG
}

export default FloatNone
