/**
 * @description hoverbar 配置
 * @author wangfupeng
 */

import { Node, Element, Text, Editor, Range } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { CustomElement } from '../../../../custom-types'

const COMMON_HOVERBAR_KEYS = {
  // key 即 element type
  link: {
    menuKeys: ['editLink', 'unLink', 'viewLink'],
  },
  image: {
    menuKeys: [
      'imageWidth30',
      'imageWidth50',
      'imageWidth100',
      'editImage',
      'viewImageLink',
      'deleteImage',
    ],
  },
  video: {
    menuKeys: ['deleteVideo'],
  },
  pre: {
    menuKeys: ['codeBlock', 'codeSelectLang'],
  },
  table: {
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
  divider: {
    menuKeys: ['deleteDivider'],
  },
}

export function genDefaultHoverbarKeys() {
  return {
    ...COMMON_HOVERBAR_KEYS,

    // 也可以自定义 match 来匹配元素，此时 key 就随意了
    text: {
      match: (editor: IDomEditor, n: Node) => {
        const { selection } = editor
        if (selection == null) return false // 无选区
        if (Range.isCollapsed(selection)) return false // 未选中文字，选区的是折叠的

        const selectedElems = DomEditor.getSelectedElems(editor)
        const notMatch = selectedElems.some((elem: CustomElement) => {
          if (editor.isVoid(elem)) return true

          const { type } = elem
          if (['pre', 'code', 'table'].includes(type)) return true
        })
        if (notMatch) return false

        if (Text.isText(n)) return true // 匹配 text node
        return false
      },
      menuKeys: [
        'headerSelect',
        'insertLink',
        'bulletedList',
        '|',
        'bold',
        'through',
        'color',
        'bgColor',
        'clearStyle',
      ],
    },
    // other hover bar ...
  }
}

export function genSimpleHoverbarKeys() {
  return COMMON_HOVERBAR_KEYS
}
