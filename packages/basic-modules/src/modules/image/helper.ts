/**
 * @description image menu helper
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { getMenuConf } from '../_helpers/menu'
import { checkNodeType, getSelectedNodeByType } from '../_helpers/node'

function check(
  menuKey: string,
  editor: IDomEditor,
  src: string,
  alt: string = '',
  url: string = ''
): boolean {
  const { checkImage } = getMenuConf(editor, menuKey)
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
  const { onInsertedImage } = getMenuConf(editor, 'insertImage')
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

  const selectedImageNode = getSelectedNodeByType(editor, 'image')
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
      match: n => checkNodeType(n, 'image'),
    }
  )

  // 回调
  const { onUpdatedImage } = getMenuConf(editor, 'editImage')
  if (onUpdatedImage) onUpdatedImage(src, alt, url)
}
