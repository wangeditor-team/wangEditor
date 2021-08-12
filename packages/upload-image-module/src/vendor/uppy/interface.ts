/**
 * @description uppy 相关接口
 * @author wangfupeng
 */

import { UppyFile } from '@uppy/core'

type FilesType = { [key: string]: UppyFile<{}, {}> }

type InsertFn = (src: string, alt: string, href: string) => void

export interface IUploadConfig {
  server: string
  fieldName?: string
  maxFileSize?: number
  maxNumberOfFiles?: number
  allowedFileTypes?: string[]
  meta?: object
  metaWithUrl: false
  headers?: object
  withCredentials?: boolean
  timeout?: number
  onBeforeUpload?: (files: FilesType) => boolean | FilesType
  onSuccess: (file: UppyFile<{}, {}>, response: any) => void
  onProgress?: (progress: number) => void
  onFailed: (file: UppyFile<{}, {}>, response: any) => void
  onError: (file: UppyFile<{}, {}>, error: any, res: any) => void

  // ----------------- 分割线，以下属性 uppy 用不到 -----------------

  // 用户自定义插入图片
  customInsert?: (res: any, insertFn: InsertFn) => void

  // 用户自定义上传图片
  customUpload?: (files: File[], insertFn: InsertFn) => void

  // base64 限制（单位 kb） - 小于 xxx 就插入 base64 格式
  base64LimitKB: number

  // 自定义选择图片，如图床
  customBrowseAndUpload?: (insertFn: InsertFn) => void
}
