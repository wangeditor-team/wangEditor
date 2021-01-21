/**
 * @description table tooltip 测试
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import GetNode from '../../../../src/menus/table/bind-event/event/getNode'

let getNodeUtil: GetNode

describe('Table getNode Util', () => {
    beforeAll(() => {
        const editor = createEditor(document, 'div1')
        getNodeUtil = new GetNode(editor)
    })

    test('getRowNode 获取当前dom节点的行元素', () => {
        const td = document.createElement('td')
        const tr = document.createElement('tr')
        tr.appendChild(td)
        document.body.appendChild(tr)

        expect(getNodeUtil.getRowNode(td)).toEqual(tr)
    })

    test('getRowNode 如果当前焦点没有父元素，直接返回当前元素', () => {
        const div = document.createElement('div')
        document.body.appendChild(div)

        Object.defineProperty(div, 'parentNode', {
            value: null,
        })

        expect(getNodeUtil.getRowNode(div)).toEqual(div)
    })

    test('getCurrentRowIndex 获取当前表格行的序号', () => {
        const table = document.createElement('table')
        const body = document.createElement('tbody')
        const td = document.createElement('td')
        const tr0 = document.createElement('tr')
        const tr1 = document.createElement('tr')
        tr0.appendChild(td)
        tr1.appendChild(td)
        body.appendChild(tr0)
        body.appendChild(tr1)
        table.appendChild(body)
        document.body.appendChild(table)

        expect(getNodeUtil.getCurrentRowIndex(table, tr1)).toEqual(1)
    })

    test('getCurrentRowIndex 获取当前表格行的序号，如果表格有 colgroup 也不会受影响', () => {
        const table = document.createElement('table')
        const body = document.createElement('tbody')
        const group = document.createElement('colgroup')
        const td = document.createElement('td')
        const tr0 = document.createElement('tr')
        const tr1 = document.createElement('tr')
        tr0.appendChild(td)
        tr1.appendChild(td)
        body.appendChild(tr0)
        body.appendChild(tr1)
        table.appendChild(group)
        table.appendChild(body)
        document.body.appendChild(table)

        expect(getNodeUtil.getCurrentRowIndex(table, tr1)).toEqual(1)
    })

    test('getCurrentColIndex 获取当前表格列的序号', () => {
        const table = document.createElement('table')
        const body = document.createElement('tbody')
        const td0 = document.createElement('td')
        const td1 = document.createElement('td')
        const tr = document.createElement('tr')
        tr.appendChild(td0)
        tr.appendChild(td1)
        body.appendChild(tr)
        table.appendChild(body)
        document.body.appendChild(table)

        expect(getNodeUtil.getCurrentColIndex(td1)).toEqual(1)
    })

    test('getTableHtml 获取当前表格 html 内容', () => {
        const table = document.createElement('table')
        const body = document.createElement('tbody')
        const td = document.createElement('td')
        const tr = document.createElement('tr')
        tr.appendChild(td)
        body.appendChild(tr)
        table.appendChild(body)

        expect(getNodeUtil.getTableHtml(table)).toEqual(
            `<table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td></td></tr></tbody></table>`
        )
    })
})
