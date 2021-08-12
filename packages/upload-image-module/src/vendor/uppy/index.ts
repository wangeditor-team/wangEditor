/**
 * @description uppy 文件上传 https://uppy.io/docs/uppy/
 * @author wangfupeng
 */

import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { IUploadConfig } from './interface'
import { addQueryToUrl } from '../../utils/util'

export function genUppy(config: IUploadConfig) {
  // 获取配置
  const {
    server = '',
    fieldName = '',
    maxFileSize = 10 * 1024 * 1024, // 10M
    maxNumberOfFiles = 100,
    meta = {},
    metaWithUrl = false,
    headers = {},
    withCredentials = false,
    timeout = 10 * 1000, // 10s
    onBeforeUpload = files => files,
    onSuccess = (file, res) => {
      /* on success */
    },
    onError = (file, err, res) => {
      console.error(`${file.name} upload error`, err, res)
      alert(`${file.name} upload error`)
    },
    onProgress = progress => {
      /* on progress */
    },
  } = config

  // 判断配置项
  if (!server) {
    throw new Error('Cannot get upload server address from menu config')
  }
  if (!fieldName) {
    throw new Error('Cannot get fieldName from menu config')
  }

  // 是否要追加 url 参数
  let url = server
  if (metaWithUrl) {
    url = addQueryToUrl(url, meta)
  }

  // 生成 uppy 实例
  const uppy = Uppy({
    onBeforeUpload,
    restrictions: {
      maxFileSize,
      maxNumberOfFiles,
    },
    meta, // 自定义添加到 formData 中的参数
  }).use(XHRUpload, {
    endpoint: url, // 服务端 url
    headers, // 自定义 headers
    formData: true,
    fieldName,
    bundle: true,
    withCredentials,
    timeout,
  })

  // 各个 callback
  uppy.on('upload-success', (file, response) => {
    const { body = {} } = response
    onSuccess(file, body)
    uppy.removeFile(file.id) // 清空文件
  })
  uppy.on('progress', progress => {
    onProgress(progress)
  })
  uppy.on('error', error => {
    console.error('wangEditor file upload error', error.stack)
  })
  uppy.on('upload-error', (file, error, response) => {
    onError(file, error, response)
    uppy.removeFile(file.id) // 清空文件
  })

  // 返回实例
  return uppy
}
