/**
 * @description gen uploader
 * @author wangfupeng
 */

import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { IUploadConfig } from './interface'
import { addQueryToUrl } from '../utils/util'

function createUploader(config: IUploadConfig): Uppy {
  // 获取配置
  const {
    server = '',
    fieldName = '',
    maxFileSize = 10 * 1024 * 1024, // 10M
    maxNumberOfFiles = 100, // 最多多少个文件
    meta = {},
    metaWithUrl = false,
    headers = {},
    withCredentials = false,
    timeout = 10 * 1000, // 10s
    onBeforeUpload = files => files,
    onSuccess = (file, res) => {
      /* on success */
    },
    onError = (file, err, res?) => {
      console.error(`${file.name} upload error`, err, res)
    },
    onProgress = progress => {
      /* on progress */
    },
  } = config

  // 判断配置项
  if (!server) {
    throw new Error('Cannot get upload server address\n没有配置上传地址')
  }
  if (!fieldName) {
    throw new Error('Cannot get fieldName\n没有配置 fieldName')
  }

  // 是否要追加 url 参数
  let url = server
  if (metaWithUrl) {
    url = addQueryToUrl(url, meta)
  }

  // 生成 uppy 实例，参考文档 https://uppy.io/docs/uppy/
  const uppy = new Uppy({
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
    try {
      // 有用户传入的第三方代码，得用 try catch 包裹
      onSuccess(file, body)
    } catch (err) {
      console.error('wangEditor upload file - onSuccess error', err)
    }
    uppy.removeFile(file.id) // 清空文件
  })

  uppy.on('progress', progress => {
    // progress 值范围： 0 - 100
    if (progress < 1) return
    onProgress(progress)
  })

  // uppy.on('error', error => {
  //   console.error('wangEditor file upload error', error.stack)
  // })

  uppy.on('upload-error', (file, error, response) => {
    try {
      // 有用户传入的第三方代码，得用 try catch 包裹
      onError(file, error, response)
    } catch (err) {
      console.error('wangEditor upload file - onError error', err)
    }
    uppy.removeFile(file.id) // 清空文件
  })

  uppy.on('restriction-failed', (file, error) => {
    try {
      // 有用户传入的第三方代码，得用 try catch 包裹
      onError(file, error)
    } catch (err) {
      console.error('wangEditor upload file - onError error', err)
    }
    uppy.removeFile(file.id) // 清空文件
  })

  // 返回实例
  return uppy
}

export default createUploader
