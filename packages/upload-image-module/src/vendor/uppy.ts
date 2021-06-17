/**
 * @description uppy 文件上传 https://uppy.io/docs/uppy/
 * @author wangfupeng
 */

import Uppy, { UppyOptions, UppyFile } from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

type FilesType = { [key: string]: UppyFile<{}, {}> }

interface IUploadConfig {
  server: string
  onBeforeUpload?: (files: FilesType) => boolean | FilesType
  onSuccess: (file: UppyFile<{}, {}>, response: any) => void
  onProgress?: (progress: number) => void
  onError?: (file: UppyFile<{}, {}>, error: any) => void
}

export function genUppy(config: IUploadConfig) {
  // 获取配置
  const { server = '', onBeforeUpload = files => files } = config

  // 生成 uppy 实例
  const uppy = Uppy<Uppy.StrictTypes>({
    onBeforeUpload,
  }).use(XHRUpload, {
    endpoint: server,
    formData: true,
    fieldName: 'wangeditor',
  })

  // 各个 callback
  uppy.on('upload-success', (file, response) => {
    console.log('upload-success', file.name, response.body) // TODO 调用 config 回调
  })
  uppy.on('progress', progress => {
    // progress: integer (total progress percentage)
    console.log('progress', progress) // TODO 调用 config 回调
  })
  uppy.on('error', error => {
    console.error('error', error.stack) // TODO 调用 config 回调
  })
  uppy.on('upload-error', (file, error, response) => {
    console.log('error with file:', file.id)
    console.log('error message:', error) // TODO 调用 config 回调
  })

  // 返回实力
  return uppy
}
