/**
 * @description menus 相关函数
 * @author wangfupeng
 */

import Editor from '../../src/editor'

/**
 * 获取单个 menu 实例
 * @param editor 编辑器实例
 * @param constructor menu 构造函数
 */
function getMenuInstance(editor: Editor, constructor: Function): any {
    const menuInstance = editor.menus.menuList.filter(menu => {
        return menu instanceof constructor
    })[0]
    if (menuInstance == null) {
        throw new Error('找不到菜单实例')
    }
    return menuInstance
}

export { getMenuInstance }
