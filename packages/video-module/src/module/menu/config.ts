/**
 * @description video menu config
 * @author wangfupeng
 */

import { IUploadConfig } from '@wangeditor/core'
import { VideoElement } from '../custom-types'

type InsertFn = (src: string, poster: string) => void

// 在通用 uploadConfig 上，扩展 video 相关配置
export type IUploadConfigForVideo = IUploadConfig & {
  allowedFileTypes?: string[]
  // 用户自定义插入视频
  customInsert?: (res: any, insertFn: InsertFn) => void
  // 用户自定义上传视频
  customUpload?: (files: File, insertFn: InsertFn) => void
  // 自定义选择视频，如图床
  customBrowseAndUpload?: (insertFn: InsertFn) => void
}

export function genUploadVideoMenuConfig(): IUploadConfigForVideo {
  return {
    server: '', // server API 地址，需用户配置

    fieldName: 'wangeditor-uploaded-video', // formData 中，文件的 key
    maxFileSize: 10 * 1024 * 1024, // 10M
    maxNumberOfFiles: 5, // 最多上传 xx 个视频
    allowedFileTypes: ['video/*'],
    meta: {
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      // 例如：token: 'xxxxx', x: 100
    },
    metaWithUrl: false,
    // headers: {
    //   // 自定义 http headers
    //   // 例如：Accept: 'text/x-json', a: 100,
    // },
    withCredentials: false,
    timeout: 30 * 1000, // 30s

    onBeforeUpload: (files: any) => files, // 返回 false 则终止上传
    onProgress: (progress: number) => {
      /* on progress */
    },
    onSuccess: (file: any, res: any) => {
      /* on success */
    },
    onFailed: (file: any, res: any) => {
      /* on failed */
      console.error(`'${file.name}' upload failed`, res)
    },
    onError: (file: any, err: any, res: any) => {
      /* on error */
      /* on timeout */
      console.error(`'${file.name} upload error`, err, res)
    },

    // 自定义插入视频，用户配置
    // customInsert: (res, insertFn) => {},

    // 自定义上传视频，用户配置
    // customUpload: (file, insertFn) => {},

    // 自定义选择，并上传视频，如：图床 （用户配置）
    // customBrowseAndUpload: insertFn => {},
  }
}

/**
 * 生成插入网络视频的配置
 */
export function genInsertVideoMenuConfig() {
  return {
    onInsertedVideo(node: VideoElement) {
      // 插入视频之后的 callback
    },

    /**
     * 检查 video ，支持 async
     * @param src src
     * @param poster poster
     */
    checkVideo(src: string, poster: string): boolean | string | undefined {
      // 1. 返回 true ，说明检查通过
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入
      return true
    },

    /**
     * 转换 video src
     * @param src src
     * @returns new src
     */
    parseVideoSrc(src: string): string {
      return src
    },
  }
}
