/**
 * @description video menu test
 * @author luochao
 */

import createEditor from '../../../../tests/utils/create-editor'
import UploadVideoMenu from '../../src/module/menu/UploadVideoMenu'
import * as core from '@wangeditor/core'
import * as slate from 'slate'
import $ from '../../src/utils/dom'

function setEditorSelection(
  editor: core.IDomEditor,
  selection: slate.Selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }
) {
  editor.selection = selection
}

describe('videoModule module', () => {
  describe('module UploadVideoMenu', () => {
    const uploadVideoMenu = new UploadVideoMenu()
    const editor = createEditor()

    test('UploadVideoMenu invoke getValue function should be empty string', () => {
      expect(uploadVideoMenu.getValue(editor)).toBe('')
    })

    test('UploadVideoMenu invoke isActive function should be false', () => {
      expect(uploadVideoMenu.isActive(editor)).toBe(false)
    })

    test('UploadVideoMenu invoke isDisabled if editor selection is null that the function return true', () => {
      setEditorSelection(editor, null)
      expect(uploadVideoMenu.isDisabled(editor)).toBe(true)
    })

    test('UploadVideoMenu invoke isDisabled if editor selection is not collapsed that the function return true', () => {
      setEditorSelection(editor)

      jest.spyOn(slate.Range, 'isCollapsed').mockReturnValue(false)
      expect(uploadVideoMenu.isDisabled(editor)).toBe(true)
    })

    test('UploadVideoMenu invoke isDisabled if editor selection is not null and collapsed that the function return false', () => {
      setEditorSelection(editor)

      jest.spyOn(slate.Range, 'isCollapsed').mockReturnValue(true)
      expect(uploadVideoMenu.isDisabled(editor)).toBe(false)
    })

    test('UploadVideoMenu invoke customBrowseAndUpload if editor give customBrowseAndUpload option', () => {
      const fn = jest.fn()
      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              customBrowseAndUpload: fn,
            },
          },
        },
      })

      uploadVideoMenu.exec(editor, '')

      expect(fn).toBeCalled()
    })

    test('it should insert input element to body if invoke exec method', () => {
      const editor = createEditor()

      expect($('input').length).toBe(0)

      uploadVideoMenu.exec(editor, '')

      expect($('input').length).toBeGreaterThan(0)
    })

    test('it should insert input element with accept attr if editor config allowedFileTypes', () => {
      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              allowedFileTypes: ['video/*'],
            },
          },
        },
      })

      uploadVideoMenu.exec(editor, '')

      expect($('input')[0].getAttribute('accept')).toBe('video/*')
    })
  })
})
