/**
 * @description 表情菜单 单元测试
 * @author liuwei
 */
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import EmoticonMenu from '../../../src/menus/emoticon/index'
import { getMenuInstance } from '../../helpers/menus'
let editor: Editor
let emoticonMenu: EmoticonMenu
test('表情 菜单：点击弹出 panel', () => {
    editor = createEditor(document, 'div1')
    emoticonMenu = getMenuInstance(editor, EmoticonMenu) as EmoticonMenu
    emoticonMenu.clickHandler()
    expect(emoticonMenu.panel).not.toBeNull()
})
