/**
 * @description toolbar i18n test（切换语言后菜单 tooltip / title 应同步更新，issue #6089）
 * @author xiwen
 */

import createCoreEditor from '../create-core-editor'
import createToolbarForSrc from '../../src/create/create-toolbar'
import { registerMenu, IButtonMenu } from '../../src/menus/index'
import { i18nAddResources, i18nChangeLanguage, t } from '../../src/i18n'
import { IDomEditor } from '../../src/editor/interface'

const MENU_KEY = 'myI18nMenu'

i18nAddResources('zh-CN', { myI18nMenu: { title: '加粗' } })
i18nAddResources('en', { myI18nMenu: { title: 'Bold' } })

// title 在实例化时由 t() 算出，和 basic-modules 里的菜单写法一致
class MyI18nMenu implements IButtonMenu {
  readonly title = t('myI18nMenu.title')
  readonly iconSvg = '<svg></svg>' // 有 icon 才会生成 tooltip
  readonly tag = 'button'
  getValue(editor: IDomEditor) {
    return ''
  }
  isActive(editor: IDomEditor) {
    return false
  }
  isDisabled(editor: IDomEditor) {
    return false
  }
  exec(editor: IDomEditor, value: string | boolean) {}
}

registerMenu({
  key: MENU_KEY,
  factory() {
    return new MyI18nMenu()
  },
})

function createToolbar(editor: IDomEditor) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return createToolbarForSrc(editor, {
    selector: container,
    config: { toolbarKeys: [MENU_KEY] },
  })
}

// toolbar 在微任务中注册菜单，等一个宏任务
function flush() {
  return new Promise(resolve => setTimeout(resolve))
}

function getTooltip(toolbar: ReturnType<typeof createToolbar>) {
  return toolbar.$box.find(`button[data-menu-key="${MENU_KEY}"]`).attr('data-tooltip')
}

describe('toolbar i18n', () => {
  afterEach(() => {
    i18nChangeLanguage('zh-CN')
  })

  it('tooltip and menu title follow language change after toolbar created', async () => {
    const editor = createCoreEditor()
    const toolbar = createToolbar(editor)
    await flush()

    expect(getTooltip(toolbar)).toBe('加粗')
    expect(toolbar.getMenus()[MENU_KEY].title).toBe('加粗')

    i18nChangeLanguage('en')

    expect(getTooltip(toolbar)).toBe('Bold')
    expect(toolbar.getMenus()[MENU_KEY].title).toBe('Bold')
    // 菜单只应有一份，不能重复追加
    expect(toolbar.$box.find(`button[data-menu-key="${MENU_KEY}"]`).length).toBe(1)
  })

  it('language change after editor destroyed should not throw', async () => {
    const editor = createCoreEditor()
    createToolbar(editor)
    await flush()

    editor.destroy()
    expect(() => i18nChangeLanguage('en')).not.toThrow()
  })
})
