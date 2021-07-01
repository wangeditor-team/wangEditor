/**
 * @description image menu helper
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function check(
  menuKey: string,
  editor: IDomEditor,
  src: string,
  alt: string = '',
  url: string = ''
): boolean {
  const { checkImage } = editor.getMenuConfig(menuKey)
  if (checkImage) {
    const res = checkImage(src, alt, url)
    if (typeof res === 'string') {
      // 检验未通过，提示信息
      editor.alert(res, 'error')
      return false
    }
    if (res == null) {
      // 检验未通过，不提示信息
      return false
    }
  }

  return true
}

export function insertImageNode(
  editor: IDomEditor,
  src: string,
  alt: string = '',
  url: string = ''
) {
  const res = check('insertImage', editor, src, alt, url)
  if (!res) return // 检查失败，终止操作

  // 新建一个 image node
  const image = {
    type: 'image',
    src,
    url,
    alt,
    style: {},
    children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
  }

  // 插入图片
  Transforms.insertNodes(editor, image)

  // 回调
  const { onInsertedImage } = editor.getMenuConfig('insertImage')
  if (onInsertedImage) onInsertedImage(src, alt, url)
}

export function updateImageNode(
  editor: IDomEditor,
  src: string,
  alt: string = '',
  url: string = '',
  style: any = {}
) {
  const res = check('editImage', editor, src, alt, url)
  if (!res) return // 检查失败，终止操作

  const selectedImageNode = DomEditor.getSelectedNodeByType(editor, 'image')
  if (selectedImageNode == null) return
  // @ts-ignore
  const { style: curStyle = {} } = selectedImageNode

  // 修改图片
  const nodeProps = {
    src,
    alt,
    url,
    style: {
      ...curStyle,
      ...style,
    },
  }
  Transforms.setNodes(
    editor,
    // @ts-ignore
    nodeProps,
    {
      match: n => DomEditor.checkNodeType(n, 'image'),
    }
  )

  // 回调
  const { onUpdatedImage } = editor.getMenuConfig('editImage')
  if (onUpdatedImage) onUpdatedImage(src, alt, url)
}
