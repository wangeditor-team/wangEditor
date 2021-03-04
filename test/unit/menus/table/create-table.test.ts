/**
 * @description 创建 table 测试
 * @author luochao
 */
import CreateTable from '../../../../src/menus/table/create-table'
import createEditor from '../../../helpers/create-editor'
import mockCommand from '../../../helpers/command-mock'
import $ from '../../../../src/utils/dom-core'
import { EMPTY_P } from '../../../../src/utils/const'

let editor: ReturnType<typeof createEditor>
let createTableInstance: CreateTable
let id = 1

describe('Create Table Util', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
        createTableInstance = new CreateTable(editor)

        mockCommand(document)
        document.queryCommandSupported = jest.fn().mockReturnValue(true)
    })

    test('调用 createAction 能创建指定行和列的表格', () => {
        createTableInstance.createAction(2, 1)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>${EMPTY_P}`
        )
    })

    test('如果当前选区在无序序列中，调用 createAction 将不会执行插入表格操作', () => {
        const liParent = $('<ul></ul>')
        const li = $('<li></li>')
        liParent.append(li)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockReturnValue(li)

        createTableInstance.createAction(1, 1)

        expect(document.execCommand).not.toBeCalledWith()
    })

    test('如果当前选区在有序序列中，调用 createAction 将不会执行插入表格操作', () => {
        const liParent = $('<ol></ol>')
        const li = $('<li></li>')
        liParent.append(li)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockReturnValue(li)

        createTableInstance.createAction(1, 1)

        expect(document.execCommand).not.toBeCalledWith()
    })
})
