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

  it('render table th elem', () => {
    const elem = { type: 'table-cell', children: [], isHeader: true }
    const vnode = renderTableCellConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('th')
  })

  it('render table row elem', () => {
    expect(renderTableRowConf.type).toBe('table-row')

    const elem = { type: 'table-row', children: [] }
    const vnode = renderTableRowConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('tr')
  })

  it('render table elem', () => {
    expect(renderTableConf.type).toBe('table')

    const elem = { type: 'table', children: [] }
    const vnode = renderTableConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('table')
  })

  it('render table elem with full with', () => {
    const elem = { type: 'table', children: [], fullWidth: true }
    const vnode = renderTableConf.renderElem(elem, null, editor)
    expect(vnode.data!.className).toBe('full-width')
  })
})
