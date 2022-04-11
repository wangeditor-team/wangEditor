/**
 * @description create toolbar for test
 * @author wangfupeng
 */
import { createToolbar as create } from '../../packages/editor/src'

export default function createToolbar(editor: any, config: any = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  return create({
    editor,
    selector: container,
    config,
  })
}
