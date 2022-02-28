/**
 * @description paragraph render elem test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { renderParagraphConf } from '../../src/modules/paragraph/render-elem'

describe('paragraph - render elem', () => {
  const editor = createEditor()

  it('render paragraph', () => {
    expect(renderParagraphConf.type).toBe('paragraph')

    const elem = { type: 'paragraph', children: [] }
    const vnode = renderParagraphConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('p')
  })
})
