/**
 * @description create editor for test
 * @author luochao
 */
import { createEditor as create } from '../../packages/editor/src'

export default function createEditor(selector: string, options?: any, config?: any) {
  const container = document.createElement('div')
  container.id = selector
  document.body.appendChild(container)

  return create({
    textareaSelector: `#${selector}`,
    ...options,
    config,
  })
}
