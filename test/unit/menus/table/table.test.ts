/**
 * @description table menu 测试
 * @author luochao
 */
import Table from '../../../../src/menus/table'
import createEditor from '../../../helpers/create-editor'

describe('Table Menu', () => {
    test('点击 table menu 会展示创建 table panel', () => {
        const editor = createEditor(document, 'div1')
        const tableMenu = new Table(editor)

        tableMenu.clickHandler()

        expect(tableMenu.panel).not.toBeNull()
    })
})
