/**
 * @description link helper
 * @author wangfupeng
 */

import { Editor, Range, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { LinkElement } from './custom-types'
import { replaceSymbols } from '../../utils/util'

/**
 * 校验 link
 * @param menuKey menu key
 * @param editor editor
 * @param text menu text
 * @param url menu url
 */
async function check(
  menuKey: string,
  editor: IDomEditor,
  text: string,
  url: string
): Promise<boolean> {
  const { checkLink } = editor.getMenuConfig(menuKey)
  if (checkLink) {
    const res = await checkLink(text, url)
    if (typeof res === 'string') {
      // 检验未通过，提示信息
      editor.alert(res, 'error')
      return false
    }
    if (res == null) {
      // 检验未通过，不提示信息
      return false
    }
  }

  return true // 校验通过
}

/**
 * 转换链接 url
 * @param menuKey menu key
 * @param editor editor
 * @param url url
 * @returns parsedUrl
 */
async function parse(menuKey: string, editor: IDomEditor, url: string): Promise<string> {
  const { parseLinkUrl } = editor.getMenuConfig(menuKey)
  if (parseLinkUrl) {
    const newUrl = await parseLinkUrl(url)
    return newUrl
  }
  return url
}

export function isMenuDisabled(editor: IDomEditor): boolean {
  if (editor.selection == null) return true

  const selectedElems = DomEditor.getSelectedElems(editor)
  const notMatch = selectedElems.some(elem => {
    const { type } = elem
    if (editor.isVoid(elem)) return true
    if (['pre', 'code', 'link'].includes(type)) return true
  })
  if (notMatch) return true // disabled
  return false // enable
}

/**
 * 插入 link
 * @param editor editor
 * @param text text
 * @param url url
 */
export async function insertLink(editor: IDomEditor, text: string, url: string) {
  if (!url) return
  if (!text) text = url // 无 text 则用 url 代替

  // 检查 maxLength
  if (DomEditor.checkMaxLength(editor, text)) {
    return
  }

  // 还原选区
  editor.restoreSelection()

  if (isMenuDisabled(editor)) return

  // 校验
  const checkRes = await check('insertLink', editor, text, url)
  if (!checkRes) return // 校验未通过

  // 转换 url
  const parsedUrl = await parse('insertLink', editor, url)

  // 判断选区是否折叠
  const { selection } = editor
  if (selection == null) return
  const isCollapsed = Range.isCollapsed(selection)
  // 新建一个 link node
  const linkNode: LinkElement = {
    type: 'link',
    url: replaceSymbols(parsedUrl),
    children: isCollapsed ? [{ text }] : [],
  }

  // 执行：插入链接
  if (isCollapsed) {
    // 链接前后插入空格，方便操作
    editor.insertText(' ')
    Transforms.insertNodes(editor, linkNode)

    // https://github.com/wangeditor-team/wangEditor-v5/issues/332
    // 不能直接使用 insertText, 会造成添加的空格被添加到链接文本中，参考上面 issue，替换为 insertFragment 方式添加空格
    editor.insertFragment([{ text: ' ' }])
  } else {
    Transforms.wrapNodes(editor, linkNode, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

/**
 * 修改 link url
 * @param editor editor
 * @param text text
 * @param url link url
 */
export async function updateLink(editor: IDomEditor, text: string, url: string) {
  if (!url) return

  // 校验
  const checkRes = await check('editLink', editor, text, url)
  if (!checkRes) return // 校验未通过

  // 转换 url
  const parsedUrl = await parse('editLink', editor, url)

  // 修改链接
  const props: Partial<LinkElement> = { url: replaceSymbols(parsedUrl) }
  Transforms.setNodes(editor, props, {
    match: n => DomEditor.checkNodeType(n, 'link'),
  })
}
