/**
 * @description insert video
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import { replaceSymbols } from '../../utils/util'
import { VideoElement } from '../custom-types'

/**
 * 插入视频
 * @param editor editor
 * @param src video src
 * @param poster video poster
 */
export default async function (editor: IDomEditor, src: string, poster = '') {
  if (!src) return

  // 还原选区
  editor.restoreSelection()

  // 校验
  const { onInsertedVideo, checkVideo, parseVideoSrc } = editor.getMenuConfig('insertVideo')
  const checkRes = await checkVideo(src, poster)
  if (typeof checkRes === 'string') {
    // 校验失败，给出提示
    editor.alert(checkRes, 'error')
    return
  }
  if (checkRes == null) {
    // 校验失败，不给提示
    return
  }

  // 转换 src
  let parsedSrc = await parseVideoSrc(src)

  if (parsedSrc.trim().indexOf('<iframe ') !== 0) {
    parsedSrc = replaceSymbols(parsedSrc)
  }

  // 新建一个 video node
  const video: VideoElement = {
    type: 'video',
    src: parsedSrc,
    poster,
    children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
  }

  // 插入视频
  // 不使用此方式会比正常的选区选取先执行
  Promise.resolve().then(() => {
    Transforms.insertNodes(editor, video)
  })

  // 调用 callback
  onInsertedVideo(video)
}
