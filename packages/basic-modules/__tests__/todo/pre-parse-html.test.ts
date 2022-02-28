/**
 * @description todo pre-parse html
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { preParseHtmlConf } from '../../src/modules/todo/pre-parse-html'

describe('todo - pre-parse html', () => {
  it('pre-parse html', () => {
    // v4 todo html 格式
    const $ul = $(
      '<ul class="w-e-todo"><li><span contenteditable="false"><input type="checkbox"/></span>hello <b>world</b></li></ul>'
    )

    // match selector
    expect($ul[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = preParseHtmlConf.preParseHtml($ul[0])
    expect(res.outerHTML).toBe(
      '<div data-w-e-type="todo"><input type="checkbox">hello <b>world</b></div>'
    )
  })
})
