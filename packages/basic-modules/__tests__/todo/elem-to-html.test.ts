/**
 * @description todo elem to html test
 * @author wangfupeng
 */

import { todoToHtmlConf } from '../../src/modules/todo/elem-to-html'

describe('todo - elem to html', () => {
  it('todo elem to html', () => {
    expect(todoToHtmlConf.type).toBe('todo')

    const todoNode1 = {
      type: 'todo',
      checked: true,
      children: [{ text: '' }],
    }
    const html1 = todoToHtmlConf.elemToHtml(todoNode1, 'hello')
    expect(html1).toBe(
      `<div data-w-e-type="todo"><input type="checkbox" disabled checked>hello</div>`
    )

    const todoNode2 = {
      type: 'todo',
      checked: false,
      children: [{ text: '' }],
    }
    const html2 = todoToHtmlConf.elemToHtml(todoNode2, 'hello')
    expect(html2).toBe(`<div data-w-e-type="todo"><input type="checkbox" disabled >hello</div>`)
  })
})
