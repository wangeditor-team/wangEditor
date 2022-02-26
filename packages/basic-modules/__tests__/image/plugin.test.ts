/**
 * @description image plugin test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import withImage from '../../src/modules/image/plugin'

describe('image plugin', () => {
  const editor = withImage(createEditor())
  const elem = { type: 'image', children: [{ text: '' }] }

  it('image is inline', () => {
    expect(editor.isInline(elem)).toBeTruthy()
  })

  it('image is void', () => {
    expect(editor.isVoid(elem)).toBeTruthy()
  })
})
