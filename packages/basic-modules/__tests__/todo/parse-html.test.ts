/**
 * @description todo parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseHtmlConf } from '../../src/modules/todo/parse-elem-html'

describe('todo - parse html', () => {
  const editor = createEditor()

  it('with children, checked', () => {
    const $todo = $('<div data-w-e-type="todo"><input type="checkbox" disabled checked>hello</div>')

    // match selector
    expect($todo[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseHtmlConf.parseElemHtml($todo[0], [], editor)
    expect(res).toEqual({
      type: 'todo',
      checked: true,
      children: [{ text: 'hello' }],
    })
  })

  it('without children, unchecked', () => {
    const $todo = $('<div data-w-e-type="todo"><input type="checkbox" disabled></div>')
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]

    // match selector
    expect($todo[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseHtmlConf.parseElemHtml($todo[0], children, editor)
    expect(res).toEqual({
      type: 'todo',
      checked: false,
      children: [{ text: 'hello ' }, { text: 'world', bold: true }],
    })
  })
})
