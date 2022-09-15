/**
 * @description 上传文件
 * @author wangfupeng
 */

import Uppy, { UppyFile } from '@uppy/core'
import { IDomEditor, createUploader } from '@wangeditor/core'
import { insertImageNode } from '@wangeditor/basic-modules'
import { IUploadConfigForImage } from './menu/config'

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
    // 成功：{ errno: 0, data: { url, alt, href } } —— 注意，旧版的 data 是数组，要兼容一下
    // 失败：{ errno: !0, message: '失败信息' }

    if (customInsert) {
      // 用户自定义插入图片，此时 res 格式可能不符合预期
      customInsert(res, (src, alt, href) => insertImageNode(editor, src, alt, href))
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

    if (Array.isArray(data)) {
      // 返回的数组（旧版的，兼容一下）
      data.forEach((item: { url: string; alt?: string; href?: string }) => {
        const { url = '', alt = '', href = '' } = item
        // 使用 basic-module 的 insertImageNode 方法插入图片，其中有用户配置的校验和 callback
        insertImageNode(editor, url, alt, href)
      })
    } else {
      // 返回的对象
      const { url = '', alt = '', href = '' } = data
      insertImageNode(editor, url, alt, href)
    }

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
    // 回调函数
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

function getMenuConfig(editor: IDomEditor) {
  return editor.getMenuConfig('uploadImage') as IUploadConfigForImage
}

/**
 * 插入 base64 格式
 * @param editor editor
 * @param file file
 */
async function insertBase64(editor: IDomEditor, file: File) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const { result } = reader
      if (!result) return
      const src = result.toString()
      let href = src.indexOf('data:image') === 0 ? '' : src // base64 格式则不设置 href
      insertImageNode(editor, src, file.name, href)

      resolve('ok')
    }
  })
}

/**
 * 上传图片文件
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

/**
 * 上传图片
 * @param editor editor
 * @param files files
 */
export default async function (editor: IDomEditor, files: FileList | null) {
  if (files == null) return
  const fileList = Array.prototype.slice.call(files)

  // 获取菜单配置
  const { customUpload, base64LimitSize } = getMenuConfig(editor)

  // 按顺序上传
  for await (const file of fileList) {
    const size = file.size // size kb
    if (base64LimitSize && size <= base64LimitSize) {
      // 允许 base64 ，而且 size 在 base64 限制之内，则插入 base64 格式
      await insertBase64(editor, file)
    } else {
      // 上传
      if (customUpload) {
        // 自定义上传
        await customUpload(file, (src, alt, href) => insertImageNode(editor, src, alt, href))
      } else {
        // 默认上传
        await uploadFile(editor, file)
      }
    }
  }
}
