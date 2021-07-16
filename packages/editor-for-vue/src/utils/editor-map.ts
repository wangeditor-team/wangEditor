/**
 * @description 根据 editorId 存储 editor
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/editor-cattle'

const EDITOR_MAP: { [key: string]: IDomEditor } = {}

export function recordEditor(editorId: string, editor: IDomEditor) {
  EDITOR_MAP[editorId] = editor
}

export function getEditor(editorId: string): IDomEditor | null {
  return EDITOR_MAP[editorId] || null
}

export function removeEditor(editorId: string) {
  delete EDITOR_MAP[editorId]
}
