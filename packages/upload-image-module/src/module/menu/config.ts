/**
 * @description upload image config
 * @author wangfupeng
 */

import { IUploadConfig } from '../../vendor/uppy/interface'

export function genUploadImageConfig(): IUploadConfig {
  return {
    server: '', // server API 地址，需用户配置

    fieldName: 'wangeditor-uploaded-file', // formData 中，文件的 key
    maxFileSize: 2 * 1024 * 1024, // 2M
    maxNumberOfFiles: 100, // 最多上传 xx 张图片
    allowedFileTypes: ['image/*'],
    meta: {
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      // 例如：token: 'xxxxx', x: 100
    },
    headers: {
      // 自定义 http headers
      // 例如：Accept: 'text/x-json', a: 100,
    },
    withCredentials: false,
    timeout: 10 * 1000, // 10s

    onBeforeUpload: (files: any) => files, // 返回 false 则终止上传
    onProgress: (progress: number) => {
      /* on progress */
    },
    onSuccess: (file: any, res: any) => {
      /* on success */
    },
    onFailed: (file: any, res: any) => {
      /* on failed */
    },
    onError: (file: any, err: any, res: any) => {
      // TODO onTimeout 也在这里，文档中说明
      /* on error */
    },

    // 自定义插入图片，用户配置
    // customInsert: (res, insertFn) => {},

    // 自定义上传图片，用户配置
    // customUpload: (files, insertFn) => {},

    // 小于 xxx 就插入 base64
    base64LimitKB: 0,

    // 自定义选择，并上传图片，如：图床 （用户配置）
    // customBrowseAndUpload: insertFn => {},
  }
}
