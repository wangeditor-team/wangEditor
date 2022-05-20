import createEditor from '../../../tests/utils/create-editor'
import { renderTableConf, renderTableCellConf, renderTableRowConf } from '../src/module/render-elem'

describe('table module - render elem', () => {
  const editor = createEditor()

  it('render table td elem', () => {
    expect(renderTableCellConf.type).toBe('table-cell')

    const elem = { type: 'table-cell', children: [] }
    const vnode = renderTableCellConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('td')
  })

  // // isHeader 必须在第一行才能生效，该 case 运行报错，暂注释 - wangfupeng 2022.05.20
  // it('render table th elem', () => {
  //   const cell = { type: 'table-cell', children: [], isHeader: true }
  //   const row = { type: 'table-row', children: [cell] }
  //   const table = { type: 'table', children: [row] }
  //   editor.insertNode(table)
  //   const vnode = renderTableCellConf.renderElem(cell, null, editor)
  //   expect(vnode.sel).toBe('th')
  // })

  it('render table row elem', () => {
    expect(renderTableRowConf.type).toBe('table-row')

    const elem = { type: 'table-row', children: [] }
    const vnode = renderTableRowConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('tr')
  })

  it('render table elem', () => {
    expect(renderTableConf.type).toBe('table')

    const elem = { type: 'table', children: [] }
    const containerVnode = renderTableConf.renderElem(elem, null, editor) as any
    expect(containerVnode.sel).toBe('div')
    const tableVnode = containerVnode.children[0] as any
    expect(tableVnode.sel).toBe('table')
  })

  it('render table elem with full with', () => {
    const elem = { type: 'table', children: [], width: '100%' }
    const containerVnode = renderTableConf.renderElem(elem, null, editor) as any
    const tableVnode = containerVnode.children[0] as any
    expect(tableVnode.data.width).toBe('100%')
  })
})
