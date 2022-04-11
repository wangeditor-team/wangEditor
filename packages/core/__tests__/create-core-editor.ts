/**
 * @description create editor - 用于 packages/core 单元测试
 * @author wangfupeng
 */

import createEditor from '../src/create/create-editor'

export default function (options: any = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  return createEditor({
    selector: container,
    ...options,
  })
}
