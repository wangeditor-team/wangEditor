/**
 * @description upload image menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor, t } from '@wangeditor/core'
import { insertImageNode, isInsertImageMenuDisabled } from '@wangeditor/basic-modules'
import { UPLOAD_IMAGE_SVG } from '../../constants/svg'
import $ from '../../utils/dom'
import { IUploadConfigForImage } from './config'
import uploadImages from '../upload-images'

class UploadImage implements IButtonMenu {
  readonly title = t('uploadImgModule.uploadImage')
  readonly iconSvg = UPLOAD_IMAGE_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    return isInsertImageMenuDisabled(editor)
  }

  private getMenuConfig(editor: IDomEditor): IUploadConfigForImage {
    // 获取配置，见 `./config.js`
    return editor.getMenuConfig('uploadImage') as IUploadConfigForImage
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
      uploadImages(editor, files) // 上传文件
    })
  }
}

export default UploadImage
