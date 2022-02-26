/**
 * @description header - render elem test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import {
  renderHeader1Conf,
  renderHeader2Conf,
  renderHeader3Conf,
  renderHeader4Conf,
  renderHeader5Conf,
} from '../../src/modules/header/render-elem'

describe('render header elem', () => {
  const editor = createEditor()

  it('render h1', () => {
    expect(renderHeader1Conf.type).toBe('header1')

    const elem = { type: 'header1', children: [] }
    const vnode = renderHeader1Conf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('h1')
  })

  it('render h2', () => {
    expect(renderHeader2Conf.type).toBe('header2')

    const elem = { type: 'header2', children: [] }
    const vnode = renderHeader2Conf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('h2')
  })

  it('render h3', () => {
    expect(renderHeader3Conf.type).toBe('header3')

    const elem = { type: 'header3', children: [] }
    const vnode = renderHeader3Conf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('h3')
  })

  it('render h4', () => {
    expect(renderHeader4Conf.type).toBe('header4')

    const elem = { type: 'header4', children: [] }
    const vnode = renderHeader4Conf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('h4')
  })

  it('render h5', () => {
    expect(renderHeader5Conf.type).toBe('header5')

    const elem = { type: 'header5', children: [] }
    const vnode = renderHeader5Conf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('h5')
  })
})
