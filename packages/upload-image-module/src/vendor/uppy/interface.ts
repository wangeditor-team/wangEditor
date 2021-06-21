/**
 * @description uppy 相关接口
 * @author wangfupeng
 */

import { UppyFile } from '@uppy/core'

type FilesType = { [key: string]: UppyFile<{}, {}> }

export interface IUploadConfig {
  server: string
  fieldName?: string
  maxFileSize?: number
  maxNumberOfFiles?: number
  allowedFileTypes?: string[]
  meta?: object
  headers?: object
  withCredentials?: boolean
  timeout?: number
  onBeforeUpload?: (files: FilesType) => boolean | FilesType
  onSuccess: (file: UppyFile<{}, {}>, response: any) => void
  onProgress?: (progress: number) => void
  onFailed: (file: UppyFile<{}, {}>, response: any) => void
  onError: (file: UppyFile<{}, {}>, error: any, res: any) => void
}
