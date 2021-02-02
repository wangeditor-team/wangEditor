import Editor from '../../../../src/editor'
import createEditor from '../../../helpers/create-editor'
import todo from '../../../../src/menus/todo/index'
import { getMenuInstance } from '../../../helpers/menus'

const editor: Editor = createEditor(document, 'div1')
const boldMenu = getMenuInstance(editor, todo)
editor.txt.append('<p>abc</p><p>test</p>')
test('设置todo功能', () => {
    boldMenu.clickHandler()
    expect(editor.txt.html()).toEqual(
        `<p>abc</p><ul class="w-e-todo"><li><span contenteditable="false"><input type="checkbox"/></span>test</li></ul>`
    )
})

test('取消todo功能', () => {
    boldMenu.clickHandler()
    expect(editor.txt.html()).toEqual(`<p>abc</p><p>test</p>`)
})

test('在第一行设置todo', () => {
    const editor = createEditor(document, 'div2')
    const boldMenu = getMenuInstance(editor, todo)
    boldMenu.clickHandler()
    expect(editor.txt.html()).toEqual(
        '<ul class="w-e-todo"><li><span contenteditable="false"><input type="checkbox"/></span><br/></li></ul>'
    )
})
