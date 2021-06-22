/**
 * @description editor index
 * @author wangfupeng
 */

// 引入必要的 css
import './assets/index.less'
import '@wangeditor/core/css/style.css'
import '@wangeditor/basic-modules/css/style.css'
import '@wangeditor/table-module/css/style.css'
import '@wangeditor/list-module/css/style.css'

import { Node, Text, Editor, Range } from 'slate'
import {
  IDomEditor,
  createEditor,

  // 注册菜单
  registerMenu,

  // 渲染 modal -> view
  registerTextStyleHandler,
  registerRenderElemConf,

  // to html
  registerTextStyleToHtmlHandler,
  registerTextToHtmlHandler,
  registerElemToHtmlConf,
} from '@wangeditor/core'

// 基础功能模块
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
  lineHeight,
  undoRedo,
  divider,
  codeBlock,
} from '@wangeditor/basic-modules'

// list
import { listModule } from '@wangeditor/list-module'
// 视频
import { videoModule } from '@wangeditor/video-module'
// 表格
import { tableModule } from '@wangeditor/table-module'
// 上传图片
import { uploadImageModule } from '@wangeditor/upload-image-module'

// 代码高亮
import { codeHighlightModule, codeHighLightDecorate } from '@wangeditor/code-highlight'
import '@wangeditor/code-highlight/css/style.css'

import { INDENT_RIGHT_SVG, JUSTIFY_LEFT_SVG, IMAGE_SVG } from './constants/svg'

const plugins = []

// --------------------- 注册 p ---------------------
if (p.renderElems && p.renderElems.length) {
  p.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (p.elemsToHtml && p.elemsToHtml.length) {
  p.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}

// --------------------- 注册 simpleStyle module ---------------------
if (simpleStyle.renderTextStyle) {
  registerTextStyleHandler(simpleStyle.renderTextStyle)
}
if (simpleStyle.textToHtml) {
  registerTextToHtmlHandler(simpleStyle.textToHtml)
}
if (simpleStyle.menus && simpleStyle.menus.length) {
  simpleStyle.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 header module ---------------------
if (header.renderTextStyle) {
  registerTextStyleHandler(header.renderTextStyle)
}
if (header.renderElems && header.renderElems.length) {
  header.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (header.elemsToHtml && header.elemsToHtml.length) {
  header.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
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
if (link.elemsToHtml && link.elemsToHtml.length) {
  link.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
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
if (image.elemsToHtml && image.elemsToHtml.length) {
  image.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
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
if (blockquote.elemsToHtml && blockquote.elemsToHtml.length) {
  blockquote.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
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
if (color.renderTextStyle) {
  registerTextStyleHandler(color.renderTextStyle)
}
if (color.textStyleToHtml) {
  registerTextStyleToHtmlHandler(color.textStyleToHtml)
}
if (color.menus && color.menus.length) {
  color.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 fontSizeAndFamily module ---------------------
if (fontSizeAndFamily.renderTextStyle) {
  registerTextStyleHandler(fontSizeAndFamily.renderTextStyle)
}
if (fontSizeAndFamily.textStyleToHtml) {
  registerTextStyleToHtmlHandler(fontSizeAndFamily.textStyleToHtml)
}
if (fontSizeAndFamily.menus && fontSizeAndFamily.menus.length) {
  fontSizeAndFamily.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 indent module ---------------------
if (indent.renderTextStyle) {
  registerTextStyleHandler(indent.renderTextStyle)
}
if (indent.textStyleToHtml) {
  registerTextStyleToHtmlHandler(indent.textStyleToHtml)
}
if (indent.menus && indent.menus.length) {
  indent.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 justify module ---------------------
if (justify.renderTextStyle) {
  registerTextStyleHandler(justify.renderTextStyle)
}
if (justify.textStyleToHtml) {
  registerTextStyleToHtmlHandler(justify.textStyleToHtml)
}
if (justify.menus && justify.menus.length) {
  justify.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 lineHeight module ---------------------
if (lineHeight.renderTextStyle) {
  registerTextStyleHandler(lineHeight.renderTextStyle)
}
if (lineHeight.textStyleToHtml) {
  registerTextStyleToHtmlHandler(lineHeight.textStyleToHtml)
}
if (lineHeight.menus && lineHeight.menus.length) {
  lineHeight.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 undoRedo module ---------------------
if (undoRedo.menus && undoRedo.menus.length) {
  undoRedo.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 listModule module ---------------------
if (listModule.renderElems && listModule.renderElems.length) {
  listModule.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (listModule.elemsToHtml && listModule.elemsToHtml.length) {
  listModule.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (listModule.menus && listModule.menus.length) {
  listModule.menus.forEach(menuConf => registerMenu(menuConf))
}
if (listModule.editorPlugin) {
  plugins.push(listModule.editorPlugin)
}

// --------------------- 注册 divider module ---------------------
if (divider.renderElems && divider.renderElems.length) {
  divider.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (divider.elemsToHtml && divider.elemsToHtml.length) {
  divider.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (divider.menus && divider.menus.length) {
  divider.menus.forEach(menuConf => registerMenu(menuConf))
}
if (divider.editorPlugin) {
  plugins.push(divider.editorPlugin)
}

// --------------------- 注册 videoModule module ---------------------
if (videoModule.renderElems && videoModule.renderElems.length) {
  videoModule.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (videoModule.elemsToHtml && videoModule.elemsToHtml.length) {
  videoModule.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (videoModule.menus && videoModule.menus.length) {
  videoModule.menus.forEach(menuConf => registerMenu(menuConf))
}
if (videoModule.editorPlugin) {
  plugins.push(videoModule.editorPlugin)
}

// --------------------- 注册 codeBlock module ---------------------
if (codeBlock.renderElems && codeBlock.renderElems.length) {
  codeBlock.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (codeBlock.elemsToHtml && codeBlock.elemsToHtml.length) {
  codeBlock.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (codeBlock.menus && codeBlock.menus.length) {
  codeBlock.menus.forEach(menuConf => registerMenu(menuConf))
}
if (codeBlock.editorPlugin) {
  plugins.push(codeBlock.editorPlugin)
}

// --------------------- 代码高亮 ---------------------
if (codeHighlightModule.renderTextStyle) {
  registerTextStyleHandler(codeHighlightModule.renderTextStyle)
}
if (codeHighlightModule.elemsToHtml && codeHighlightModule.elemsToHtml.length) {
  codeHighlightModule.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (codeHighlightModule.menus && codeHighlightModule.menus.length) {
  codeHighlightModule.menus.forEach(menuConf => registerMenu(menuConf))
}

// --------------------- 注册 tableModule module ---------------------
if (tableModule.renderElems && tableModule.renderElems.length) {
  tableModule.renderElems.forEach(renderElemConf => registerRenderElemConf(renderElemConf))
}
if (tableModule.elemsToHtml && tableModule.elemsToHtml.length) {
  tableModule.elemsToHtml.forEach(toHtmlConf => registerElemToHtmlConf(toHtmlConf))
}
if (tableModule.menus && tableModule.menus.length) {
  tableModule.menus.forEach(menuConf => registerMenu(menuConf))
}
if (tableModule.editorPlugin) {
  plugins.push(tableModule.editorPlugin)
}

// --------------------- 注册 uploadImageModule module ---------------------
if (uploadImageModule.menus && uploadImageModule.menus.length) {
  uploadImageModule.menus.forEach(menuConf => registerMenu(menuConf))
}
if (uploadImageModule.editorPlugin) {
  plugins.push(uploadImageModule.editorPlugin)
}

// --------------------- 创建 editor 实例 ---------------------
let editor = createEditor(
  'editor-container',
  {
    // 传统菜单栏
    toolbarKeys: [
      'header',
      'blockquote',
      '|',
      'bold',
      'underline',
      'italic',
      'through',
      'code',
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

          const [parent] = Editor.parent(editor, selection, { edge: 'start' })
          // @ts-ignore
          const { type: parentType = '' } = parent || {}
          if (parentType === 'code' || parentType === 'pre') return false // code-block 不允许

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
      // video hover bar
      {
        // @ts-ignore
        match: (editor, n) => n.type === 'video',
        menuKeys: ['deleteVideo'],
      },
      // code-block hover bar
      {
        // @ts-ignore
        match: (editor, n) => n.type === 'pre',
        menuKeys: ['codeBlock', 'codeSelectLang'],
      },
      // table hover bar
      {
        // @ts-ignore
        match: (editor, n) => n.type === 'table',
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

    onChange() {
      // console.log('selection', editor.selection, editor.children)
      // console.log('getHtml--------\n', editor.getHtml())
      // console.log('getText--------\n', editor.getText())

      const html = editor.getHtml()
      // @ts-ignore
      document.getElementById('editor-content-view').innerHTML = html
    },

    plugins,

    decorate: codeHighLightDecorate,
  },
  // @ts-ignore
  window.content
)

// console.log('editor', editor)
// console.log('editor.config', editor.getConfig())
