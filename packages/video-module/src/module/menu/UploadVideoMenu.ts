/**
 * @description upload video menu
 * @author wangfupeng
 */

import { Range } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import $ from '../../utils/dom'
import { UPLOAD_VIDEO_SVG } from '../../constants/svg'
import { IUploadConfigForVideo } from './config'
import insertVideo from '../helper/insert-video'
import uploadVideos from '../helper/upload-videos'

class UploadVideoMenu implements IButtonMenu {
  readonly title = t('videoModule.uploadVideo')
  readonly iconSvg = UPLOAD_VIDEO_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const { allowedFileTypes = [], customBrowseAndUpload } = this.getMenuConfig(editor)

    // 自定义选择图片，并上传，如图床
    if (customBrowseAndUpload) {
      customBrowseAndUpload((src, poster) => insertVideo(editor, src, poster))
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
      uploadVideos(editor, files) // 上传文件
    })
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    const selectedElems = DomEditor.getSelectedElems(editor)
    const hasVoidOrPre = selectedElems.some(elem => {
      const type = DomEditor.getNodeType(elem)
      if (type === 'pre') return true
      if (type === 'list-item') return true
      if (editor.isVoid(elem)) return true
      return false
    })
    if (hasVoidOrPre) return true // void 或 pre ，禁用

    return false
  }

  private getMenuConfig(editor: IDomEditor): IUploadConfigForVideo {
    // 获取配置，见 `./config.js`
    return editor.getMenuConfig('uploadVideo') as IUploadConfigForVideo
  }
}

export default UploadVideoMenu
