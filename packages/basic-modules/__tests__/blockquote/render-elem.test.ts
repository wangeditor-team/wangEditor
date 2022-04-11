/**
 * @description blockquote render elem test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { renderBlockQuoteConf } from '../../src/modules/blockquote/render-elem'

describe('blockquote - render elem', () => {
  const editor = createEditor()

  it('render blockquote elem', () => {
    expect(renderBlockQuoteConf.type).toBe('blockquote')

    const elem = { type: 'blockquote', children: [] }
    const vnode = renderBlockQuoteConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('blockquote')
  })
})
