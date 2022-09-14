/**
 * @description font-size font-family config
 * @author wangfupeng
 */

export function genFontSizeConfig() {
  const fontSizeList: Array<string | { name: string; value: string }> = [
    // 元素支持两种形式：1. 字符串；2. { name: 'xxx', value: 'xxx' }
    '12px',
    { name: '13px', value: '13px' },
    '14px',
    '15px',
    '16px',
    '19px',
    { name: '22px', value: '22px' },
    '24px',
    '29px',
    '32px',
    '40px',
    '48px',
  ]

  return fontSizeList
}

export function getFontFamilyConfig() {
  let fontFamilyList: Array<string | { name: string; value: string }> = [
    // 元素支持两种形式：1. 字符串；2. { name: 'xxx', value: 'xxx' }
    '黑体',
    { name: '仿宋', value: '仿宋' },
    '楷体',
    '标楷体',
    '华文仿宋',
    '华文楷体',
    { name: '宋体', value: '宋体' },
    '微软雅黑',
    'Arial',
    'Tahoma',
    'Verdana',
    'Times New Roman',
    'Courier New',
  ]

  return fontFamilyList
}
