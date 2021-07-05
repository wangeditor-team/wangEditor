/**
 * @description toolbar 配置
 * @author wangfupeng
 */

import { INDENT_RIGHT_SVG, JUSTIFY_LEFT_SVG, IMAGE_SVG, MORE_SVG } from '../constants/svg'

export function genToolbarKeys() {
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
  ]
}
