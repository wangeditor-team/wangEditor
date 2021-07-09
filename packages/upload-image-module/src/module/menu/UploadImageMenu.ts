/**
 * @description upload image menu
 * @author wangfupeng
 */

import Uppy, { UppyFile } from '@uppy/core'
import { IButtonMenu, IDomEditor, DomEditor } from '@wangeditor/core'
import { insertImageNode } from '@wangeditor/basic-modules'
import { UPLOAD_IMAGE_SVG } from '../../constants/svg'
import { genUppy } from '../../vendor/uppy'
import { isMenuDisabled } from '../helper'
import $ from '../../utils/dom'
import { IUploadConfig } from '../../vendor/uppy/interface'

class UploadImage implements IButtonMenu {
  readonly title = '上传图片'
  readonly iconSvg = UPLOAD_IMAGE_SVG
  readonly tag = 'button'
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
    return editor.getMenuConfig('uploadImage') as IUploadConfig
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const { allowedFileTypes = [], customBrowseAndUpload } = this.getMenuConfig(editor)

    // 自定义选择图片，并上传，如图床
    if (customBrowseAndUpload) {
      customBrowseAndUpload((src, alt, href) => insertImageNode(editor, src, alt, href))
      return
    }

    // 设置选择文件的类型
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
    const fileList = Array.prototype.slice.call(files)
    let fileListForUpload: File[] = []

    const { customUpload, base64LimitKB } = this.getMenuConfig(editor)

    // 插入 base64
    if (base64LimitKB) {
      fileList.forEach(file => {
        const sizeKB = file.size / 1024 // size kb
        if (sizeKB > base64LimitKB) {
          // 超过配置的 limit ，则上传图片
          fileListForUpload.push(file)
        } else {
          // 未超过，则插入 base64 ，不上传
          this.insertBase64(editor, file)
        }
      })
    } else {
      // 未设置 base64LimitKB ，则全部上传
      fileListForUpload = fileList
    }

    // 用户自定义上传，不用默认的上传
    if (customUpload) {
      customUpload(fileListForUpload, (src, alt, href) => insertImageNode(editor, src, alt, href))
      return
    }

    // 上传图片
    this.uploadFiles(editor, fileListForUpload)
  }

  private insertBase64(editor: IDomEditor, file: File) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const { result } = reader
      if (!result) return
      const src = result.toString()
      insertImageNode(editor, src, file.name, src)
    }
  }

  private uploadFiles(editor: IDomEditor, files: File[]) {
    const menuConfig = this.getMenuConfig(editor)
    const { onSuccess, onProgress, onFailed, customInsert, onError } = menuConfig

    // 上传完成之后
    const successHandler = (file: UppyFile, res: any) => {
      // 预期 res 格式：
      // 成功：{ errno: 0, data: [ { url, alt, href }, {}, {} ] }
      // 失败：{ errno: !0, message: '失败信息' }
      // TODO 文档中说明

      if (customInsert) {
        // 用户自定义插入图片，此时 res 格式可能不符合预期
        customInsert(res, (src, alt, href) => insertImageNode(editor, src, alt, href))
        return
      }

      const { errno = 1, message = '上传失败\nUpload failed', data = [] } = res
      if (errno !== 0) {
        console.error(`'${file.name}' upload failed`, res)
        editor.alert(message, 'error')

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

    // onError 提示错误
    const errorHandler = (file: any, err: any, res: any) => {
      console.error(`'${file.name} upload error`, err, res)

      let info = `'${file.name}' 上传错误\n'${file.name}' upload error`
      editor.alert(info, 'error')

      // 回调函数
      onError && onError(file, err, res)
    }

    // 创建 uppy 实例
    if (this.uppy == null) {
      this.uppy = genUppy({
        ...menuConfig,
        onProgress: progressHandler,
        onSuccess: successHandler,
        onError: errorHandler,
      })
    }
    const uppy = this.uppy

    // 将文件添加到 uppy
    files.forEach(file => {
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
