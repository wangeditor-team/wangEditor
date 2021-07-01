/**
 * @description link helper
 * @author wangfupeng
 */

import { Editor, Range, Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

/**
 * 校验 link
 * @param menuKey menu key
 * @param editor editor
 * @param text menu text
 * @param url menu url
 */
function check(menuKey: string, editor: IDomEditor, text: string, url: string): boolean {
  const { checkLink } = editor.getMenuConfig(menuKey)
  if (checkLink) {
    const res = checkLink(text, url)
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

export function isMenuDisabled(editor: IDomEditor): boolean {
  if (editor.selection == null) return true

  const [match] = Editor.nodes(editor, {
    // @ts-ignore
    match: n => {
      // @ts-ignore
      const { type = '' } = n

      if (type === 'pre') return true // 代码块
      if (Editor.isVoid(editor, n)) return true // void node
      if (type === 'link') return true // 当前处于链接之内

      return false
    },
    universal: true,
  })

  if (match) return true
  return false
}
/**
 * 插入 link
 * @param editor editor
 * @param text text
 * @param url url
 */
export function insertLink(editor: IDomEditor, text: string, url: string) {
  if (!url) return
  if (!text) text = url // 无 text 则用 url 代替

  // 还原选区
  DomEditor.restoreSelection(editor)

  if (isMenuDisabled(editor)) return

  // 校验
  const checkRes = check('insertLink', editor, text, url)
  if (!checkRes) return // 校验未通过

  // 判断选区是否折叠
  const { selection } = editor
  if (selection == null) return
  const isCollapsed = Range.isCollapsed(selection)

  // 新建一个 link node
  const linkNode = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text }] : [],
  }

  // 执行：插入链接
  if (isCollapsed) {
    Transforms.insertNodes(editor, linkNode)
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
export function updateLink(editor: IDomEditor, text: string, url: string) {
  if (!url) return

  // 校验
  const checkRes = check('updateLink', editor, text, url)
  if (!checkRes) return // 校验未通过

  // 修改链接
  Transforms.setNodes(
    editor,
    // @ts-ignore
    { url },
    {
      match: n => DomEditor.checkNodeType(n, 'link'),
    }
  )
}
