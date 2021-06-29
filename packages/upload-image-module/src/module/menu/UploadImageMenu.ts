/**
 * @description upload image menu
 * @author wangfupeng
 */

import Uppy, { UppyFile } from '@uppy/core'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { insertImageNode } from '@wangeditor/basic-modules'
import { UPLOAD_IMAGE_SVG } from '../../constants/svg'
import { genUppy } from '../../vendor/uppy'
import { getMenuConf, isMenuDisabled } from '../_helpers/menu'
import $ from '../../utils/dom'
import { IUploadConfig } from '../../vendor/uppy/interface'

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
    return isMenuDisabled(editor)
  }

  private getMenuConfig(editor: IDomEditor): IUploadConfig {
    // 获取配置，见 `./config.js`
    return getMenuConf(editor, 'uploadImage') as IUploadConfig
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 设置选择文件的类型
    const { allowedFileTypes = [] } = this.getMenuConfig(editor)
    let acceptAttr = ''
    if (allowedFileTypes.length > 0) {
      acceptAttr = `accept="${allowedFileTypes.join(', ')}"`
    }

    // 添加 file input（每次重新创建 input）
    const $body = $('body')
    const $inputFile = $(`<input type="file" ${acceptAttr} multiple/>`)
    $inputFile.hide()
    $body.append($inputFile)
    $inputFile.click()
    // 选中文件
    $inputFile.on('change', () => {
      const files = ($inputFile[0] as HTMLInputElement).files
      this.handleFiles(editor, files) // 处理文件
    })
  }

  private handleFiles(editor: IDomEditor, files: FileList | null) {
    if (files == null) return

    // TODO 处理文件，如上传、插入 base64、自定义上传等

    this.uploadFiles(editor, files)
  }

  private uploadFiles(editor: IDomEditor, files: FileList) {
    const menuConfig = this.getMenuConfig(editor)
    const { onSuccess, onProgress, onFailed } = menuConfig

    // 上传完成之后
    const successHandler = (file: UppyFile, res: any) => {
      // res 格式： { errno: 0, data: [ { url, alt, href }, {}, {} ] }
      const { errno = 1, data = [] } = res
      if (errno !== 0) {
        console.error(`'${file.name}' upload failed`, res)
        // failed 回调
        onFailed(file, res)
        return
      }

      // 插入图片
      data.forEach((item: { url: string; alt?: string; href?: string }) => {
        const { url = '', alt = '', href = '' } = item
        // 使用 basic-module 的 insertImageNode 方法插入图片，其中有用户配置的校验和 callback
        insertImageNode(editor, url, alt, href)
      })

      // success 回调
      onSuccess(file, res)
    }

    // progress 显示进度条
    const progressHandler = (progress: number) => {
      editor.showProgressBar(progress)

      // 回调函数
      onProgress && onProgress(progress)
    }

    // 创建 uppy 实例
    if (this.uppy == null) {
      this.uppy = genUppy({
        ...menuConfig,
        onProgress: progressHandler,
        onSuccess: successHandler,
      })
    }
    const uppy = this.uppy

    // 将文件添加到 uppy
    Array.prototype.slice.call(files).forEach(file => {
      const { name, type, size } = file
      uppy.addFile({
        name,
        type,
        size,
        data: file,
      })
      // 上传单个文件
      uppy.upload()
    })
    // TODO 合并多个文件一起上传
  }
}

export default UploadImage
