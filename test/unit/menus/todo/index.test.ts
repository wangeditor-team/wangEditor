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
        `<p><br></p><p>abc</p><ul data-todo-key="w-e-text-todo" style="margin:0 0 0 20px;position:relative;"><li style="list-style:none;"><span style="position: absolute;left: -18px;top: 2px;" contenteditable="false"><input type="checkbox" style="margin-right:3px;"></span>test</li></ul>`
    )
})

test('取消todo功能', () => {
    boldMenu.clickHandler()
    expect(editor.txt.html()).toEqual(`<p><br></p><p>abc</p><p>test</p>`)
})

test('在第一行设置todo', () => {
    const editor = createEditor(document, 'div2')
    const boldMenu = getMenuInstance(editor, todo)
    boldMenu.clickHandler()
    expect(editor.txt.html()).toEqual(
        '<p style="height:0px;"><br></p><ul data-todo-key="w-e-text-todo" style="margin:0 0 0 20px;position:relative;"><li style="list-style:none;"><span style="position: absolute;left: -18px;top: 2px;" contenteditable="false"><input type="checkbox" style="margin-right:3px;"></span><br></li></ul>'
    )
})
