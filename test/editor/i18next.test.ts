/**
 * @description i18next 测试
 * @author tonghan
 */

import createEditor from '../fns/create-i18next-editor'
import Editor from '../../src/editor'

let editor: Editor

test('国际化 英文', () => {
    editor = createEditor(document, 'div1', 'en') // 赋值全局变量
    expect(editor.i18next.t('插入')).toBe('insert')
    expect(editor.i18next.t('menus.dropListMenu.设置标题')).toBe('title')
    expect(editor.i18next.t('menus.dropListMenu.head.正文')).toBe('text')
})
