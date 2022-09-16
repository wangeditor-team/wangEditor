/**
 * @description button class
 * @author wangfupeng
 */

import { IButtonMenu } from '../interface'
import BaseButton from './BaseButton'

class SimpleButton extends BaseButton {
  constructor(key: string, menu: IButtonMenu, inGroup = false) {
    super(key, menu, inGroup)
  }
  onButtonClick() {
    // menu.exec 已经在 BaseButton 实现了
    // 所以，此处不用做任何逻辑
  }
}

export default SimpleButton
