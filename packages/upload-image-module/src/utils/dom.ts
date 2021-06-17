/**
 * @description DOM 操作
 * @author wangfupeng
 */

import { $, append, on, remove, val, click, hide } from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.append = append
$.fn.on = on
$.fn.remove = remove
$.fn.val = val
$.fn.click = click
$.fn.hide = hide

export default $
