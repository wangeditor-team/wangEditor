/**
 * @description basic index
 * @author wangfupeng
 */

import './assets/index.less'

// 配置多语言
import './locale/index'

import wangEditorParagraphModule from './modules/paragraph'
import wangEditorTextStyleModule from './modules/text-style'
import wangEditorHeaderModule from './modules/header'
import wangEditorColorModule from './modules/color'
import wangEditorLinkModule from './modules/link'
import wangEditorImageModule from './modules/image'
import wangEditorBlockQuoteModule from './modules/blockquote'
import wangEditorEmotionModule from './modules/emotion'
import wangEditorFontSizeAndFamilyModule from './modules/font-size-family'
import wangEditorIndentModule from './modules/indent'
import wangEditorJustifyModule from './modules/justify'
import wangEditorLineHeightModule from './modules/line-height'
import wangEditorUndoRedoModule from './modules/undo-redo'
import wangEditorDividerModule from './modules/divider'
import wangEditorCodeBlockModule from './modules/code-block'
import wangEditorFullScreenModule from './modules/full-screen'

export default [
  wangEditorTextStyleModule,
  wangEditorHeaderModule,
  wangEditorParagraphModule,
  wangEditorColorModule,
  wangEditorLinkModule,
  wangEditorImageModule,
  wangEditorBlockQuoteModule,
  wangEditorEmotionModule,
  wangEditorFontSizeAndFamilyModule,
  wangEditorIndentModule,
  wangEditorJustifyModule,
  wangEditorLineHeightModule,
  wangEditorUndoRedoModule,
  wangEditorDividerModule,
  wangEditorCodeBlockModule,
  wangEditorFullScreenModule,
]

// 输出 image 操作，供 updateImageModule 使用
export * from './modules/image/helper'
