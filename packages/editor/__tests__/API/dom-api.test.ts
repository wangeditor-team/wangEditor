/**
 * @description editor DOM API test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'

describe('editor DOM API', () => {
  function getStartLocation(editor) {
    return Editor.start(editor, [])
  }

  it('editor id', () => {
    const editor = createEditor()
    expect(editor.id).not.toBeNull()
  })

  it('isFullScreen fullScreen unFullScreen', done => {
    const editor = createEditor()

    expect(editor.isFullScreen).toBeFalsy()

    editor.fullScreen()
    expect(editor.isFullScreen).toBeTruthy()

    editor.unFullScreen()
    setTimeout(() => {
      expect(editor.isFullScreen).toBeFalsy()
      done()
    }, 1000)
  })

  // TODO focus blur isFocused 用 jest 测试异常，以及 editor-config.test.ts 中的 `onFocus` `onBlur`

  it('disable isDisabled enable', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor))

    expect(editor.isDisabled()).toBeFalsy()
    editor.insertText('123')
    expect(editor.getText().length).toBe(3)

    editor.disable()
    expect(editor.isDisabled()).toBeTruthy()
    editor.insertText('123') // disabled ，不会插入
    expect(editor.getText().length).toBe(3)

    editor.enable()
    expect(editor.isDisabled()).toBeFalsy()
    editor.insertText('123') // enable ，可以插入
    expect(editor.getText().length).toBe(6)
  })

  it('destroy', done => {
    const editor = createEditor()
    expect(editor.isDestroyed).toBeFalsy()

    setTimeout(() => {
      editor.destroy()
      expect(editor.isDestroyed).toBeTruthy()
      done()
    })
  })
})
