/**
 * @description toolbar 配置
 * @author wangfupeng
 */

import { t } from '@wangeditor/core'
import { INDENT_RIGHT_SVG, JUSTIFY_LEFT_SVG, IMAGE_SVG, MORE_SVG } from '../../constants/svg'

export function genDefaultToolbarKeys() {
  return [
    'headerSelect',
    // 'header1',
    // 'header2',
    // 'header3',
    'blockquote',
    '|',
    'bold',
    'underline',
    'italic',
    {
      key: 'group-more-style', // 以 group 开头
      title: t('editor.more'),
      iconSvg: MORE_SVG,
      menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle'],
    },
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'bulletedList',
    'numberedList',
    {
      key: 'group-justify', // 以 group 开头
      title: t('editor.justify'),
      iconSvg: JUSTIFY_LEFT_SVG,
      menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify'],
    },
    {
      key: 'group-indent', // 以 group 开头
      title: t('editor.indent'),
      iconSvg: INDENT_RIGHT_SVG,
      menuKeys: ['indent', 'delIndent'],
    },
    '|',
    'emotion',
    'insertLink',
    // 'updateLink',
    // 'unLink',
    // 'viewLink',
    {
      key: 'group-image', // 以 group 开头
      title: t('editor.image'),
      iconSvg: IMAGE_SVG,
      menuKeys: ['insertImage', 'uploadImage'],
    },
    // 'deleteImage',
    // 'editImage',
    // 'viewImageLink',
    'insertVideo',
    // 'deleteVideo',
    'insertTable',
    'codeBlock',
    // 'codeSelectLang',
    'divider',
    // 'deleteTable',
    '|',
    'undo',
    'redo',
    '|',
    'fullScreen',
  ]
}

export function genSimpleToolbarKeys() {
  return [
    'blockquote',
    'header1',
    'header2',
    'header3',
    '|',
    'bold',
    'underline',
    'italic',
    'through',
    'color',
    'bgColor',
    'clearStyle',
    '|',
    'bulletedList',
    'numberedList',
    'justifyLeft',
    'justifyRight',
    'justifyCenter',
    '|',
    'insertLink',
    {
      key: 'group-image', // 以 group 开头
      title: t('editor.image'),
      iconSvg: IMAGE_SVG,
      menuKeys: ['insertImage', 'uploadImage'],
    },
    'insertTable',
    'codeBlock',
    '|',
    'undo',
    'redo',
    '|',
    'fullScreen',
  ]
}
