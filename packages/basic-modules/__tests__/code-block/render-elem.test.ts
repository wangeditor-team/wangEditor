/**
 * @description code-block render elem test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { renderPreConf, renderCodeConf } from '../../src/modules/code-block/render-elem'

describe('code-block render elem', () => {
  const editor = createEditor()

  it('render code elem', () => {
    expect(renderCodeConf.type).toBe('code')

    const elem = { type: 'code', children: [] }
    const vnode = renderCodeConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('code')
  })

  it('render pre elem', () => {
    expect(renderPreConf.type).toBe('pre')

    const elem = { type: 'pre', children: [] }
    const vnode = renderPreConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('pre')
  })
})
