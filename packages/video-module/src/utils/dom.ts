/**
 * @description DOM 操作
 * @author wangfupeng
 */

import { $, append, on, focus, attr, val, html } from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.append = append
$.fn.on = on
$.fn.focus = focus
$.fn.attr = attr
$.fn.val = val
$.fn.html = html

export default $
