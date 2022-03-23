/**
 * @description list render elem test
 * @author luochao
 */

import createEditor from '../../../tests/utils/create-editor'
import {
  renderBulletedListConf,
  renderListItemConf,
  renderNumberedListConf,
} from '../src/module/render-elem'

describe('video module - render elem', () => {
  const editor = createEditor()

  it('render bulleted list elem', () => {
    expect(renderBulletedListConf.type).toBe('bulleted-list')

    const elem = { type: 'bulleted-list', children: [{ type: 'list-item', children: [] }] }
    const vnode = renderBulletedListConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('ul')
  })

  it('render numbered list elem', () => {
    expect(renderNumberedListConf.type).toBe('numbered-list')

    const elem = { type: 'numbered-list', children: [{ type: 'list-item', children: [] }] }
    const vnode = renderNumberedListConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('ol')
  })

  it('render list item elem', () => {
    expect(renderListItemConf.type).toBe('list-item')

    const elem = { type: 'list-item', children: [] }
    const vnode = renderListItemConf.renderElem(elem, null, editor)
    expect(vnode.sel).toBe('li')
  })
})
