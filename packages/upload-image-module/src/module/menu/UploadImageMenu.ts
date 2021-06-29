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
  private allowedFileTypes: string[] = []

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

  exec(editor: IDomEditor, value: string | boolean) {
    // 获取配置，见 `./config.js`
    const menuConfig = getMenuConf(editor, 'uploadImage') as IUploadConfig
    const { allowedFileTypes, onSuccess, onProgress, onFailed } = menuConfig

    // 设置选择文件类型
    this.allowedFileTypes = allowedFileTypes || []

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

    // 选择文件 + 触发上传
    this.browseAndUpload()
  }

  private browseAndUpload() {
    const { uppy, allowedFileTypes = [] } = this
    if (uppy == null) return

    // 选择的文件类型
    let acceptAttr = ''
    if (allowedFileTypes.length > 0) {
      acceptAttr = `accept="${allowedFileTypes.join(', ')}"`
    }

    const $body = $('body')
    const $inputFile = $(`<input type="file" ${acceptAttr} multiple/>`)
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
}

export default UploadImage
