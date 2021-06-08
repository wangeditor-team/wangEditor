/**
 * @description editor index
 * @author wangfupeng
 */

// 引入必要的 css
import './assets/index.less'
import '@wangeditor/core/css/style.css'
import '@wangeditor/basic/css/style.css'

import { Node, Range, Text } from 'slate'
import {
  IDomEditor,
  createEditor,
  registerTextStyleHandler,
  registerRenderElemConf,
  registerMenu,
} from '@wangeditor/core'
import {
  simpleStyle,
  header,
  p,
  color,
  link,
  image,
  blockquote,
  emotion,
  fontSizeAndFamily,
  indent,
  justify,
} from '@wangeditor/basic'
import { INDENT_RIGHT_SVG, JUSTIFY_LEFT_SVG } from './constants/svg'

const plugins = []

// --------------------- 注册 p ---------------------
if (p.renderElems && p.renderElems.length) {
  p.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}

// --------------------- 注册 simpleStyle module ---------------------
if (simpleStyle.addTextStyle) {
  registerTextStyleHandler(simpleStyle.addTextStyle)
}
if (simpleStyle.menus && simpleStyle.menus.length) {
  simpleStyle.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 header module ---------------------
if (header.addTextStyle) {
  registerTextStyleHandler(header.addTextStyle)
}
if (header.renderElems && header.renderElems.length) {
  header.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.menus && header.menus.length) {
  header.menus.forEach(menuConf => registerMenu(menuConf))
}
if (header.editorPlugin) {
  plugins.push(header.editorPlugin)
}

// --------------------- 注册 link module ---------------------
if (link.renderElems && link.renderElems.length) {
  link.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (link.menus && link.menus.length) {
  link.menus.forEach(menuConf => registerMenu(menuConf))
}
if (link.editorPlugin) {
  plugins.push(link.editorPlugin)
}

// --------------------- 注册 image module ---------------------
if (image.renderElems && image.renderElems.length) {
  image.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (image.menus && image.menus.length) {
  image.menus.forEach(menuConf => registerMenu(menuConf))
}
if (image.editorPlugin) {
  plugins.push(image.editorPlugin)
}

// --------------------- 注册 blockquote module ---------------------
if (blockquote.renderElems && blockquote.renderElems.length) {
  blockquote.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (blockquote.menus && blockquote.menus.length) {
  blockquote.menus.forEach(menuConf => registerMenu(menuConf))
}
if (blockquote.editorPlugin) {
  plugins.push(blockquote.editorPlugin)
}

// --------------------- 注册 emotion module ---------------------
if (emotion.menus && emotion.menus.length) {
  emotion.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 color module ---------------------
if (color.addTextStyle) {
  registerTextStyleHandler(color.addTextStyle)
}
if (color.menus && color.menus.length) {
  color.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 fontSizeAndFamily module ---------------------
if (fontSizeAndFamily.addTextStyle) {
  registerTextStyleHandler(fontSizeAndFamily.addTextStyle)
}
if (fontSizeAndFamily.menus && fontSizeAndFamily.menus.length) {
  fontSizeAndFamily.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 indent module ---------------------
if (indent.addTextStyle) {
  registerTextStyleHandler(indent.addTextStyle)
}
if (indent.menus && indent.menus.length) {
  indent.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 justify module ---------------------
if (justify.addTextStyle) {
  registerTextStyleHandler(justify.addTextStyle)
}
if (justify.menus && justify.menus.length) {
  justify.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor(
  'editor-container',
  {
    // 传统菜单栏
    toolbarKeys: [
      'header',
      '|',
      'bold',
      'underline',
      'italic',
      'through',
      'code',
      'blockquote',
      '|',
      'fontSize',
      'fontFamily',
      '|',
      'color',
      'bgColor',
      '|',
      'emotion',
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
      '|',
      'insertLink',
      'updateLink',
      'unLink',
      'viewLink',
      '|',
      'insertImage',
      'deleteImage',
      'editImage',
      'viewImageLink',
    ],

    // hover bar
    hoverbarKeys: [
      // 选中文字 hover bar
      {
        match: (editor: IDomEditor, n: Node) => {
          const { selection } = editor
          if (selection == null) return false // 无选区
          if (Range.isCollapsed(selection)) return false // 未选中文字，选区的是折叠的
          if (Text.isText(n)) return true // 匹配 text node
          return false
        },
        menuKeys: ['header', '|', 'bold', 'underline', '|', 'color'],
      },
      // link hover bar
      {
        // @ts-ignore
        match: (editor, n) => n.type === 'link', // 匹配 link node
        menuKeys: ['updateLink', 'unLink', 'viewLink'],
      },
      // image hover bar
      {
        // @ts-ignore
        match: (editor, n) => n.type === 'image', // 匹配 image node
        menuKeys: ['deleteImage', 'editImage', 'viewImageLink'],
      },
      // other hover bar ...
    ],

    onChange() {
      // console.log('selection', editor.selection)
    },

    plugins,
  },
  // @ts-ignore
  window.content
)

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
