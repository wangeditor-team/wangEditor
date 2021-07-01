/**
 * @description 获取编辑器默认配置
 * @author wangfupeng
 */

import { Node, Element, Text, Editor, Range } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { INDENT_RIGHT_SVG, JUSTIFY_LEFT_SVG, IMAGE_SVG, MORE_SVG } from './constants/svg'

function getDefaultEditorConfig() {
  return {
    // 传统菜单栏
    toolbarKeys: [
      'header',
      'blockquote',
      '|',
      'bold',
      'underline',
      'italic',
      {
        title: '更多样式',
        iconSvg: MORE_SVG,
        menuKeys: ['through', 'code'],
      },
      '|',
      'color',
      'bgColor',
      '|',
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      {
        title: '缩进',
        iconSvg: INDENT_RIGHT_SVG,
        menuKeys: ['indent', 'delIndent'],
      },
      {
        title: '对齐',
        iconSvg: JUSTIFY_LEFT_SVG,
        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter'],
      },
      'bulletedList',
      'numberedList',
      '|',
      'emotion',
      'insertLink',
      // 'updateLink',
      // 'unLink',
      // 'viewLink',
      {
        title: '图片',
        iconSvg: IMAGE_SVG,
        menuKeys: ['insertImage', 'uploadImage'],
      },
      // 'deleteImage',
      // 'editImage',
      // 'viewImageLink',
      'insertVideo',
      // 'deleteVideo',
      'codeBlock',
      // 'codeSelectLang',
      'divider',
      'insertTable',
      // 'deleteTable',
      '|',
      'undo',
      'redo',
    ],

    // hover bar
    hoverbarKeys: [
      // 选中文字 hover bar
      {
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
      // link hover bar
      {
        match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'link'),
        menuKeys: ['updateLink', 'unLink', 'viewLink'],
      },
      // image hover bar
      {
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
      // video hover bar
      {
        match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'video'),
        menuKeys: ['deleteVideo'],
      },
      // code-block hover bar
      {
        match: (editor: IDomEditor, n: Node) => DomEditor.checkNodeType(n, 'pre'),
        menuKeys: ['codeBlock', 'codeSelectLang'],
      },
      // table hover bar
      {
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
    ],

    onChange(editorCore: IDomEditor) {
      // console.log('selection', editor.selection, editor.children)
      // console.log('getHtml--------\n', editor.getHtml())
      // console.log('getText--------\n', editor.getText())
    },

    // decorate: codeHighLightDecorate,
  }
}

export default getDefaultEditorConfig
