/**
 * @description table operation-event 测试
 * @author luochao
 */
import $ from '../../../../src/utils/dom-core'
import operationEventUtil from '../../../../src/menus/table/bind-event/event/operating-event'

const createTable = (
    id: string,
    option: { withColgroup: boolean } = { withColgroup: false }
): HTMLTableElement => {
    const table = document.createElement('table')
    table.id = id
    const body = document.createElement('tbody')
    const td0 = document.createElement('td')
    const td1 = document.createElement('td')
    const tr = document.createElement('tr')
    tr.appendChild(td0)
    tr.appendChild(td1)
    body.appendChild(tr)
    // 测试有 colgroup 的 case
    if (option.withColgroup) {
        const group = document.createElement('colgroup')
        const col = document.createElement('col')
        group.appendChild(col)
        table.appendChild(group)
    }
    table.appendChild(body)
    document.body.appendChild(table)

    return table
}

describe('Table Operation Event Util', () => {
    test('ProcessingRow 在表格的指定行序号位置添加新的行', () => {
        const table = createTable('table1', { withColgroup: true })

        operationEventUtil.ProcessingRow($('#table1'), 1)

        expect(table.childNodes[0].childNodes.length).toEqual(1)
    })

    test('ProcessingCol 在表格的指定列序号位置添加新的列', () => {
        const table = createTable('table2')

        operationEventUtil.ProcessingCol($('#table2'), 1)

        expect(table.childNodes[0].childNodes[0].childNodes.length).toEqual(3)
    })

    test('DeleteRow 删除表格的指定行序号的表格行', () => {
        const table = createTable('table3')

        operationEventUtil.DeleteRow($('#table3'), 0)

        expect(table.childNodes[0].childNodes.length).toEqual(0)
    })

    test('DeleteCol 删除表格的指定列序号的表格列', () => {
        const table = createTable('table4')

        operationEventUtil.DeleteCol($('#table4'), 0)

        expect(table.childNodes[0].childNodes[0].childNodes.length).toEqual(1)
    })

    test('setTheHeader 设置表格表头', () => {
        const table = createTable('table5')

        operationEventUtil.setTheHeader($('#table5'), 0, 'th')

        expect(table.childNodes[0].childNodes[0].childNodes[0].nodeName).toEqual('TH')
    })
})
