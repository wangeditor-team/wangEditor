/**
 * @description upload interface
 * @author wangfupeng
 */

import { UppyFile } from '@uppy/core'

type FilesType = { [key: string]: UppyFile<{}, {}> }

/**
 * 配置参考 https://uppy.io/docs/uppy/
 */
export interface IUploadConfig {
  server: string
  fieldName?: string
  maxFileSize?: number
  maxNumberOfFiles?: number
  meta?: Record<string, unknown>
  metaWithUrl: boolean
  headers?:
    | Headers
    | ((file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => Headers)
    | undefined
  withCredentials?: boolean
  timeout?: number
  onBeforeUpload?: (files: FilesType) => boolean | FilesType
  onSuccess: (file: UppyFile<{}, {}>, response: any) => void
  onProgress?: (progress: number) => void
  onFailed: (file: UppyFile<{}, {}>, response: any) => void
  onError: (file: UppyFile<{}, {}>, error: any, res: any) => void
}
