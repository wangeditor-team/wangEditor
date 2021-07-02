/**
 * @description hoverbar 配置
 * @author wangfupeng
 */

import { Node, Element, Text, Editor, Range } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

export function genHoverbarKeys() {
  return [
    {
      desc: '选中文本 selected text',
      match: (editor: IDomEditor, n: Node) => {
        const { selection } = editor
        if (selection == null) return false // 无选区
        if (Range.isCollapsed(selection)) return false // 未选中文字，选区的是折叠的

        // 检查父节点
        let parentType = ''
        const [parent] = Editor.parent(editor, selection, { edge: 'start' })
        if (Element.isElement(parent)) parentType = parent.type
        if (parentType === 'code' || parentType === 'pre') return false // code-block 不允许

        if (Text.isText(n)) return true // 匹配 text node
        return false
      },
      menuKeys: ['header', '|', 'bold', 'underline', 'through', '|', 'color'],
    },
    {
      desc: '选中链接 selected link',
      match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'link'),
      menuKeys: ['updateLink', 'unLink', 'viewLink'],
    },
    {
      desc: '选中图片 selected image',
      match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'image'),
      menuKeys: [
        'imageWidth30',
        'imageWidth50',
        'imageWidth100',
        'editImage',
        'viewImageLink',
        'deleteImage',
      ],
    },
    {
      desc: '选中视频 selected video',
      match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'video'),
      menuKeys: ['deleteVideo'],
    },
    {
      desc: '选中代码块 selected code block',
      match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'pre'),
      menuKeys: ['codeBlock', 'codeSelectLang'],
    },
    {
      desc: '选中表格 selected table',
      match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'table'),
      menuKeys: [
        'tableHeader',
        'tableFullWidth',
        'insertTableRow',
        'deleteTableRow',
        'insertTableCol',
        'deleteTableCol',
        'deleteTable',
      ],
    },
    // other hover bar ...
  ]
}
