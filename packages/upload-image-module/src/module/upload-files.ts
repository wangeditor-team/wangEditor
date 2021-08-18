/**
 * @description 上传文件
 * @author wangfupeng
 */

import Uppy, { UppyFile } from '@uppy/core'
import { IDomEditor, t, createUploader } from '@wangeditor/core'
import { insertImageNode } from '@wangeditor/basic-modules'
import { IUploadConfigForImage } from './menu/config'

// 存储 editor uppy 的关系 - 缓存 uppy ，不重复创建
const EDITOR_TO_UPPY_MAP = new WeakMap<IDomEditor, Uppy.Uppy<'strict'>>()

function getMenuConfig(editor: IDomEditor) {
  return editor.getMenuConfig('uploadImage') as IUploadConfigForImage
}

/**
 * 插入 base64 格式
 * @param editor editor
 * @param file file
 */
function insertBase64(editor: IDomEditor, file: File) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const { result } = reader
    if (!result) return
    const src = result.toString()
    insertImageNode(editor, src, file.name, src)
  }
}

/**
 * 上传图片
 * @param editor editor
 * @param files files
 */
function uploadFiles(editor: IDomEditor, files: File[]) {
  const menuConfig = getMenuConfig(editor)
  const { onSuccess, onProgress, onFailed, customInsert, onError } = menuConfig

  // 上传完成之后
  const successHandler = (file: UppyFile, res: any) => {
    // 预期 res 格式：
    // 成功：{ errno: 0, data: [ { url, alt, href }, {}, {} ] }
    // 失败：{ errno: !0, message: '失败信息' }

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
    const fileName = file.name
    console.error(`'${fileName} upload error`, err, res)

    const info = t('uploadImgModule.uploadError', { fileName })
    // let info = `'${file.name}' 上传错误\n'${file.name}' upload error`
    editor.alert(info, 'error')

    // 回调函数
    onError && onError(file, err, res)
  }

  let uppy = EDITOR_TO_UPPY_MAP.get(editor)
  if (uppy == null) {
    // 创建 uppy
    uppy = createUploader({
      ...menuConfig,
      onProgress: progressHandler,
      onSuccess: successHandler,
      onError: errorHandler,
    })
    // 缓存 uppy
    EDITOR_TO_UPPY_MAP.set(editor, uppy)
  }

  // 将文件添加到 uppy
  files.forEach(file => {
    if (uppy == null) return

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

/**
 * 上传图片
 * @param editor editor
 * @param files files
 */
export default function (editor: IDomEditor, files: FileList | null) {
  if (files == null) return
  const fileList = Array.prototype.slice.call(files)
  let fileListForUpload: File[] = []

  // 获取菜单配置
  const { customUpload, base64LimitKB } = getMenuConfig(editor)

  // 插入 base64
  if (base64LimitKB) {
    fileList.forEach(file => {
      const sizeKB = file.size / 1024 // size kb
      if (sizeKB > base64LimitKB) {
        // 超过配置的 limit ，则上传图片
        fileListForUpload.push(file)
      } else {
        // 未超过，则插入 base64 ，不上传
        insertBase64(editor, file)
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
  uploadFiles(editor, fileListForUpload)
}
