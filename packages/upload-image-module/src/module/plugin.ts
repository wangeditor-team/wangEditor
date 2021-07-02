/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import Uppy, { UppyFile } from '@uppy/core'
import { insertImageNode } from '@wangeditor/basic-modules'
import { genUppy } from '../vendor/uppy'
import { isMenuDisabled } from './helper'
import { IUploadConfig } from '../vendor/uppy/interface'

// 存储 editor uppy 的关系 - 缓存 uppy ，不重复创建
const EDITOR_TO_UPPY_MAP = new WeakMap<IDomEditor, Uppy.Uppy<'strict'>>()

function withUploadImage<T extends IDomEditor>(editor: T): T {
  const { insertData } = editor
  const newEditor = editor

  // 重写 insertData - 粘贴图片、拖拽上传图片
  newEditor.insertData = (data: DataTransfer) => {
    if (isMenuDisabled(newEditor)) {
      insertData(data)
      return
    }

    // 获取文件
    const { files } = data
    if (files.length <= 0) {
      insertData(data)
      return
    }

    let _hasImageFiles = false

    // 获取/创建 uppy 实例
    let uppy = EDITOR_TO_UPPY_MAP.get(newEditor)
    if (uppy == null) {
      const menuConfig = editor.getMenuConfig('uploadImage') as IUploadConfig // 获取菜单配置
      const { onSuccess, onFailed } = menuConfig
      uppy = genUppy({
        ...menuConfig,
        onSuccess: (file: UppyFile, res: any) => {
          // res 格式： { errno: 0, data: [ { url, alt, href }, {}, {} ] }
          const { errno = 1, data = [] } = res
          if (errno !== 0) {
            console.error(`'${file.name}' upload failed`, res)
            // failed 回调
            onFailed(file, res)
            return
          }

          // 插入图片
          data.forEach((item: { url: string; alt?: string; href?: string }) => {
            const { url = '', alt = '', href = '' } = item
            // 使用 basic-module 的 insertImageNode 方法插入图片，其中有用户配置的校验和 callback
            insertImageNode(newEditor, url, alt, href)
          })

          // success 回调
          onSuccess(file, res)
        },
      })

      // 缓存 uppy
      EDITOR_TO_UPPY_MAP.set(newEditor, uppy)
    }

    // add image files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const [mime] = file.type.split('/')
      if (mime === 'image') {
        // 图片文件
        _hasImageFiles = true

        // 将文件添加到 uppy
        const { name, type, size } = file
        uppy.addFile({
          name,
          type,
          size,
          data: file,
        })
      }
    }

    // 上传
    uppy.upload()

    if (!_hasImageFiles) {
      // 如果没有 image files 则继续 insertData
      insertData(data)
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withUploadImage
