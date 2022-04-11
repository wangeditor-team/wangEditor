/**
 * @description video menu test
 * @author luochao
 */

import withVideo from '../src/module/plugin'
import createEditor from '../../../tests/utils/create-editor'

describe('videoModule module', () => {
  describe('module plugin', () => {
    test('withVideo should override editor "isVoid" and "normalizeNode" methods', () => {
      const editor = createEditor()
      const originalIsVoidFn = editor.isVoid
      const originalNormalizeNode = editor.normalizeNode

      const newEditor = withVideo(editor)

      expect(originalIsVoidFn).not.toEqual(newEditor.isVoid)
      expect(originalNormalizeNode).not.toEqual(newEditor.normalizeNode)
    })

    test('使用 withVideo 插件后，Editor 会将 Video 元素视为 void 元素', () => {
      const editor = createEditor()
      const newEditor = withVideo(editor)
      const videoElem = {
        type: 'video',
        src: 'test.mp4',
        children: [],
      }
      expect(newEditor.isVoid(videoElem)).toBeTruthy()
    })

    test('使用 withVideo 插件后，对于非 video 元素，直接调用 original isVoid 方法', () => {
      const editor = createEditor()
      const fn = jest.fn()
      editor.isVoid = fn

      const newEditor = withVideo(editor)
      const videoElem = {
        type: 'paragraph',
        children: [{ text: '' }],
      }
      newEditor.isVoid(videoElem)

      expect(fn).toBeCalled()
    })

    test('使用 withVideo 插件后，Editor 调用 normalizeNode 方法确保 Video 元素后面有 paragraph、block、header 等元素', () => {
      const videoElem = {
        type: 'video',
        src: 'test.mp4',
        children: [],
      }
      const editor = createEditor({
        content: [videoElem],
      })
      const newEditor = withVideo(editor)

      newEditor.normalizeNode([videoElem, [0]])
      expect(newEditor.children).toEqual([
        {
          type: 'video',
          src: 'test.mp4',
          children: [{ text: '' }],
        },
        { type: 'paragraph', children: [{ text: '' }] },
      ])
    })
  })
})
