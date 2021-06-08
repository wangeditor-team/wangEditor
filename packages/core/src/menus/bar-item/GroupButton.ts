/**
 * @description group button class
 * @author wangfupeng
 */

import { gen$downArrow } from '../helpers/helpers'
import $, { Dom7Array } from '../../utils/dom'
import { IMenuGroup } from '../interface'
import { clearSvgStyle } from '../helpers/helpers'

class GroupButton {
  $elem: Dom7Array = $(`<div class="w-e-bar-item"></div>`)
  $container: Dom7Array = $('<div class="w-e-bar-item-menus-container"></div>')

  constructor(menu: IMenuGroup) {
    const { title, iconSvg, menuKeys = [] } = menu
    const { $elem } = this

    // button
    const $svg = $(iconSvg)
    clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
    const $button = $(`<button tooltip="${title}"></button>`)
    $button.append($svg)

    const $arrow = gen$downArrow()
    $button.append($arrow)
    $elem.append($button)

    // menu container
    const { $container } = this
    $elem.append($container)
  }
}

export default GroupButton
