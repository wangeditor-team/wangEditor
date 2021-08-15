/**
 * @description create editor for test
 * @author luochao
 */
import { createEditor as create } from '../../packages/editor/src'

export default function createEditor(options?: any, config?: any) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  return create({
    textareaSelector: container,
    ...options,
    config,
  })
}
