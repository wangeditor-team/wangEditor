/**
 * @description upload video
 * @author wangfupeng
 */

import Uppy, { UppyFile } from '@uppy/core'
import { IDomEditor, createUploader } from '@wangeditor/core'
import insertVideo from './insert-video'
import { IUploadConfigForVideo } from '../menu/config'

function getMenuConfig(editor: IDomEditor): IUploadConfigForVideo {
  // 获取配置，见 `./config.js`
  return editor.getMenuConfig('uploadVideo') as IUploadConfigForVideo
}

// 存储 editor uppy 的关系 - 缓存 uppy ，不重复创建
const EDITOR_TO_UPPY_MAP = new WeakMap<IDomEditor, Uppy>()

/**
 * 获取 uppy 实例（并通过 editor 缓存）
 * @param editor editor
 */
function getUppy(editor: IDomEditor): Uppy {
  // 从缓存中获取
  let uppy = EDITOR_TO_UPPY_MAP.get(editor)
  if (uppy != null) return uppy

  const menuConfig = getMenuConfig(editor)
  const { onSuccess, onProgress, onFailed, customInsert, onError } = menuConfig

  // 上传完成之后
  const successHandler = (file: UppyFile, res: any) => {
    // 预期 res 格式：
    // 成功：{ errno: 0, data: { url, poster } }
    // 失败：{ errno: !0, message: '失败信息' }

    if (customInsert) {
      // 用户自定义插入视频，此时 res 格式可能不符合预期
      customInsert(res, (src, poster) => insertVideo(editor, src, poster))
      // success 回调
      onSuccess(file, res)
      return
    }

    let { errno = 1, data = {} } = res
    if (errno !== 0) {
      // failed 回调
      onFailed(file, res)
      return
    }

    const { url = '', poster = '' } = data
    insertVideo(editor, url, poster)

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
    onError(file, err, res)
  }

  // 创建 uppy
  uppy = createUploader({
    ...menuConfig,
    onProgress: progressHandler,
    onSuccess: successHandler,
    onError: errorHandler,
  })
  // 缓存 uppy
  EDITOR_TO_UPPY_MAP.set(editor, uppy)

  return uppy
}

/**
 * 上传视频文件
 * @param editor editor
 * @param file file
 */
async function uploadFile(editor: IDomEditor, file: File) {
  const uppy = getUppy(editor)

  const { name, type, size } = file
  uppy.addFile({
    name,
    type,
    size,
    data: file,
  })
  await uppy.upload()
}

export default async function (editor: IDomEditor, files: FileList | null) {
  if (files == null) return
  const fileList = Array.prototype.slice.call(files)

  // 获取菜单配置
  const { customUpload } = getMenuConfig(editor)

  // 按顺序上传
  for await (const file of fileList) {
    // 上传
    if (customUpload) {
      // 自定义上传
      await customUpload(file, (src, poster) => insertVideo(editor, src, poster))
    } else {
      // 默认上传
      await uploadFile(editor, file)
    }
  }
}
