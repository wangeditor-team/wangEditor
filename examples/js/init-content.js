/**
 * @description demo 页，初始化内容
 * @author wangfupeng
 */

window.initContent = [
  {
    type: 'header1',
    textAlign: 'center',
    children: [
      {
        text: '一行标题',
      },
    ],
  },

  {
    type: 'paragraph',
    children: [
      { text: 'hello world ~~~ ' },
      { text: ' ' },
      {
        type: 'link',
        url: 'https://www.slatejs.org/examples/links',
        children: [{ text: 'slate examples' }],
      },
      { text: '!' },
    ],
  },
  {
    type: 'pre',
    children: [
      {
        type: 'code',
        language: 'javascript',
        children: [{ text: 'const a = 100;' }],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: '图片' },
      {
        type: 'image',
        src: 'http://www.wangeditor.com/imgs/logo.jpeg',
        children: [{ text: '' }], // void node 要有一个空 text
      },
      { text: 'image' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '结束' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'header2',
    children: [
      {
        text: '二级标题',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'blockquote',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'divider',
    children: [{ text: '' }],
  },
  {
    type: 'header3',
    children: [
      {
        text: '三级标题',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '一行文字' }],
  },
]
