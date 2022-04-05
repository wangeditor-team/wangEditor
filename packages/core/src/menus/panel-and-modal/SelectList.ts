/**
 * @description SelectList class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IOption } from '../interface'
import PanelAndModal from './BaseClass'
import { IDomEditor } from '../../editor/interface'
import { SVG_CHECK_MARK } from '../../constants/svg'

// “对号”icon
function gen$SelectedIcon() {
  return $(SVG_CHECK_MARK)
}

class SelectList extends PanelAndModal {
  type = 'selectList'
  readonly $elem: Dom7Array = $(`<div class="w-e-select-list"></div>`)

  constructor(editor: IDomEditor, width?: number) {
    super(editor)

    if (width) {
      this.$elem.css('width', `${width}px`)
    }

    this.$elem.on('click', (e: Event) => {
      // selectList 如有滚动条，可能会点击拖拽，参考 https://github.com/wangeditor-team/wangEditor-v5/issues/325
      // 此时需要阻止冒泡，因为在 $container.on('mousedown', () => editor.hidePanelOrModal()) ，$container 就是 `.w-e-text-container`
      e.stopPropagation()
    })
  }

  /**
   * 渲染 list
   * @param options select options
   */
  renderList(options: IOption[]) {
    const $elem = this.$elem
    $elem.empty() // 先清空内容，再重新渲染

    const $list = $(`<ul></ul>`)
    options.forEach(opt => {
      const { value, text, selected, styleForRenderMenuList } = opt
      const $li = $(`<li data-value="${value}"></li>`) // 【注意】必须用 <li> 必须用 data-value！！！

      if (styleForRenderMenuList) {
        $li.css(styleForRenderMenuList)
      }

      if (selected) {
        const $selectedIcon = gen$SelectedIcon()
        $li.append($selectedIcon)
        $li.addClass('selected')
      }

      $li.append($(`<span data-value="${value}">${text}</span>`))
      $li.attr('title', text)
      $list.append($li)
    })
    $elem.append($list)
  }

  genSelfElem(): Dom7Array | null {
    return null
  }
}

export default SelectList
