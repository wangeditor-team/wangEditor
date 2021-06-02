/**
 * @description modal and panel
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array } from '../../utils/dom'

export interface IPanel {
  $elem: Dom7Array
  show: () => void
  hide: () => void
}

const ALL_PANELS_AND_MODALS = new Set<IPanel>()

/**
 * 收集 dropPanel selectList 等
 */
export function gatherPanelAndModal(panel: IPanel) {
  ALL_PANELS_AND_MODALS.add(panel)
}

/**
 * 统一隐藏 dropPanel selectList 等
 */
export function hideAllPanelsAndModals() {
  ALL_PANELS_AND_MODALS.forEach(panel => panel.hide())
}
$('body').on('click', debounce(hideAllPanelsAndModals, 100))
