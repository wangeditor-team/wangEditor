/**
 * @description link - render elem test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { renderLinkConf } from '../../src/modules/link/render-elem'

describe('link render elem', () => {
  const editor = createEditor()

  it('render elem', () => {
    expect(renderLinkConf.type).toBe('link')

    const url = 'https://www.wangeditor.com/'
    const target = '_blank'
    const elem = { type: 'link', url, target, children: [] }

    const vnode = renderLinkConf.renderElem(elem, null, editor) as any
    expect(vnode.sel).toBe('a')
    expect(vnode.data.href).toBe(url)
    expect(vnode.data.target).toBe(target)
  })
})
