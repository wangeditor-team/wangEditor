/**
 * @description upload image menu
 * @author wangfupeng
 */

import Uppy from '@uppy/core'
import { Transforms, Range, Editor } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { UPLOAD_IMAGE_SVG } from '../../constants/svg'
import { genUppy } from '../../vendor/uppy'
import { getMenuConf } from '../_helpers/menu'
import $ from '../../utils/dom'

class UploadImage implements IButtonMenu {
  title = '上传图片'
  iconSvg = UPLOAD_IMAGE_SVG
  tag = 'button'
  private uppy: Uppy.Uppy<'strict'> | null = null

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        if (type === 'code') return true // 行内代码
        if (type === 'pre') return true // 代码块
        if (type === 'link') return true // 链接
        if (type === 'list-item') return true // list
        if (type.startsWith('header')) return true // 标题
        if (type === 'blockquote') return true // 引用
        if (Editor.isVoid(editor, n)) return true // void

        return false
      },
      universal: true,
    })

    if (match) return true
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 获取配置
    const { uploadImageConfig } = getMenuConf(editor, 'uploadImage')
    const { server = '' } = uploadImageConfig

    // 创建 uppy 实力
    if (this.uppy == null) {
      this.uppy = genUppy({
        server,
        onSuccess: (file, res) => {
          console.log('onSuccess---', file, res)
        },
      })
    }
    const uppy = this.uppy

    // 触发弹出选择器
    const $body = $('body')
    const $inputFile = $('<input type="file" accept="image/*" multiple/>')
    $inputFile.hide()
    $body.append($inputFile)
    $inputFile.click()
    // 选中文件
    $inputFile.on('change', () => {
      const files = ($inputFile[0] as HTMLInputElement).files || []
      Array.prototype.slice.call(files).forEach(file => {
        const { name, type, size } = file
        // 将文件添加到 uppy
        uppy.addFile({
          name,
          type,
          size,
          data: file,
        })
      })
      // 上传文件
      uppy.upload()
      // 最后，移除 input
      $inputFile.remove()
    })
  }

  private insertImage(editor: IDomEditor, src: string, alt: string = '', url: string = '') {
    if (!src) return

    // 还原选区
    // DomEditor.restoreSelection(editor)

    if (this.isDisabled(editor)) return

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
  }
}

export default UploadImage
