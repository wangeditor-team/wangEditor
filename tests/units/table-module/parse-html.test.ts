/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../utils/create-editor'
// import { preParseTableHtmlConf } from '../../../../packages/table-module/src/module/pre-parse-html'
import {
  parseCellHtmlConf,
  parseRowHtmlConf,
  parseTableHtmlConf,
} from '@wangeditor/table-module/src/module/parse-elem-html'

// TODO 此处有一个关于 Dom7 的 bug ，先注释掉 - wangfupeng 2022.01.17
// describe('table - pre parse html', () => {
//   it('pre parse', () => {
//     const $table = $('<table><tbody><tr><td>hello</td></tr></tbody></table>')

//     // match selector
//     expect($table[0].matches(preParseTableHtmlConf.selector)).toBeTruthy()

//     // pre parse
//     const res = preParseTableHtmlConf.preParseHtml($table[0])
//     expect(res.outerHTML).toBe('<table><tr><td>hello</td></tr></table>')
//   })
// })

describe('table - parse html', () => {
  const editor = createEditor()

  it('table cell', () => {
    const $cell1 = $('<td>hello&nbsp;world</td>')
    expect($cell1[0].matches(parseCellHtmlConf.selector)).toBeTruthy()
    expect(parseCellHtmlConf.parseElemHtml($cell1[0], [], editor)).toEqual({
      type: 'table-cell',
      isHeader: false,
      colSpan: 1,
      rowSpan: 1,
      children: [{ text: 'hello world' }],
    })

    const $cell2 = $('<th></th>')
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]
    expect($cell2[0].matches(parseCellHtmlConf.selector)).toBeTruthy()
    expect(parseCellHtmlConf.parseElemHtml($cell2[0], children, editor)).toEqual({
      type: 'table-cell',
      isHeader: true,
      colSpan: 1,
      rowSpan: 1,
      children,
    })
  })

  it('table row', () => {
    const $tr = $('<tr></tr>')
    const children = [{ type: 'table-cell', children: [{ text: 'hello world' }] }]

    expect($tr[0].matches(parseRowHtmlConf.selector)).toBeTruthy()

    expect(parseRowHtmlConf.parseElemHtml($tr[0], children, editor)).toEqual({
      type: 'table-row',
      children,
    })
  })

  it('table', () => {
    const $table = $('<table style="width: 100%;"></table>')
    const children = [
      {
        type: 'table-row',
        children: [{ type: 'table-cell', children: [{ text: 'hello world' }] }],
      },
    ]

    expect($table[0].matches(parseTableHtmlConf.selector)).toBeTruthy()

    expect(parseTableHtmlConf.parseElemHtml($table[0], children, editor)).toEqual({
      type: 'table',
      fullWidth: true,
      children,
    })
  })
})
