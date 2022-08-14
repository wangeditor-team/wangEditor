/**
 * @description video render elem test
 * @author luochao
 */

import createEditor from '../../../tests/utils/create-editor'
import { renderVideoConf } from '../src/module/render-elem'

describe('video module - render elem', () => {
  const editor = createEditor()

  it('render video elem', () => {
    expect(renderVideoConf.type).toBe('video')

    const elem = { type: 'video', src: 'test.mp4', poster: 'xxx.png', children: [] }
    const vnode = renderVideoConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('div')
  })

  it('render video with iframe', () => {
    expect(renderVideoConf.type).toBe('video')

    const elem = { type: 'video', src: '<iframe src="test.mp4"></iframe>', children: [] }
    const vnode = renderVideoConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('div')
  })
})
