/**
 * @description group button class
 * @author wangfupeng
 */

import { gen$downArrow } from '../helpers/helpers'
import $, { Dom7Array } from '../../utils/dom'
import { IMenuGroup } from '../interface'
import { clearSvgStyle } from '../helpers/helpers'
import { IBarItem } from './index'
class GroupButton {
  readonly $elem: Dom7Array = $(`<div class="w-e-bar-item w-e-bar-item-group"></div>`)
  private readonly $container: Dom7Array = $('<div class="w-e-bar-item-menus-container"></div>')
  readonly $button = $(`<button type="button"></button>`)

  constructor(menu: IMenuGroup) {
    const { key, iconSvg, title /*, menuKeys = [] */ } = menu
    const { $elem, $button } = this

    // button
    if (iconSvg) {
      const $svg = $(iconSvg)
      clearSvgStyle($svg) // 清理 svg 样式（扩展的菜单，svg 是不可控的，所以要清理一下）
      $button.append($svg)
    } else {
      // 无 icon 则显示 title
      $button.text(title)
    }
    $button.attr('data-menu-key', key) // menu key

    const $arrow = gen$downArrow()
    $button.append($arrow)
    $elem.append($button)

    // menu container
    const { $container } = this
    $elem.append($container)

    // 监听 container 内容变化，以判断 $button 是否应该禁用
    const observer = this.createObserver()
    this.observe(observer)
  }

  appendBarItem(barItem: IBarItem) {
    const { $elem } = barItem
    this.$container.append($elem)
  }

  private observe(observer: MutationObserver) {
    const { $container } = this
    observer.observe($container[0], { childList: true, subtree: true, attributes: true })
  }

  private createObserver(): MutationObserver {
    const { $container, $button } = this

    const observer = new MutationObserver(() => {
      // 找出 container 下所有的 button
      const $buttons = $container.find('button')
      const buttonsLength = $buttons.length
      if (buttonsLength === 0) return

      // 找出所有 disabled 的 button
      let disabledButtonsLength = 0
      $buttons.each(btn => {
        const $btn = $(btn)
        if ($btn.hasClass('disabled')) {
          disabledButtonsLength++
        }
      })

      // 判断 group button 是否应该被禁用
      observer.disconnect()
      if (disabledButtonsLength === buttonsLength) {
        // 如果 container 所有的 button 都已经 disabled ，则当前的 GroupButton 也需要 disabled
        $button.addClass('disabled')
      } else {
        // 否则，取消当前的 GroupButton disabled
        $button.removeClass('disabled')
      }
      this.observe(observer)
    })

    return observer
  }
}

export default GroupButton
