/**
 * @description i18next 测试
 * @author tonghan
 */

import i18next from 'i18next'
import i18nextInit from '../../../src/editor/init-fns/i18next-init'
import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'

let editor: Editor

test('国际化 英文', () => {
    editor = createEditor(document, 'div1') // 赋值全局变量
    editor.i18next = i18next
    editor.config.lang = 'en'
    i18nextInit(editor)
    expect(editor.i18next.t('插入')).toBe('insert')
    expect(editor.i18next.t('menus.dropListMenu.设置标题')).toBe('title')
    expect(editor.i18next.t('menus.dropListMenu.head.正文')).toBe('text')
})
