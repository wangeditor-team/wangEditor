/**
 * @description editor config test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'

describe('editor config', () => {
  function getStartLocation(editor) {
    return Editor.start(editor, [])
  }

  it('readOnly', () => {
    const editor = createEditor({
      config: {
        readOnly: true,
      },
    })
    expect(editor.isDisabled()).toBeTruthy()

    editor.select(getStartLocation(editor))
    editor.insertText('xxx') // readOnly 时无法插入文本
    expect(editor.getText()).toBe('')
  })

  it('autoFocus', () => {
    createEditor({
      config: {
        autoFocus: false,
      },
    })
    // @ts-ignore
    expect(document.activeElement.tagName).toBe('BODY')
  })

  it('maxLength', done => {
    const editor = createEditor({
      config: {
        maxLength: 10,
        onMaxLength: () => {
          done() // 触发回调，才能完成该测试
        },
      },
    })
    editor.select(getStartLocation(editor))

    // 插入 10 个字符，正好等于 maxLength
    editor.insertText('1234567890')
    expect(editor.getText()).toBe('1234567890')

    // 再插入字符，则不会插入成功
    editor.insertText('xx')
    expect(editor.getText()).toBe('1234567890')
  })

  it('onCreated', done => {
    createEditor({
      config: {
        onCreated: () => {
          done() // 触发回调，才能完成该测试
        },
      },
    })
  })

  it('onChange', done => {
    const editor = createEditor({
      config: {
        onChange: () => {
          done() // 触发回调，才能完成该测试
        },
      },
    })
    setTimeout(() => {
      editor.select(getStartLocation(editor)) // 选区变化，触发 onchange
    })
  })

  it('onDestroyed', done => {
    const editor = createEditor({
      config: {
        onDestroyed: () => {
          done() // 触发回调，才能完成该测试
        },
      },
    })
    setTimeout(() => {
      editor.destroy()
    })
  })

  // it('onFocus', done => {
  //   const editor = createEditor({
  //     config: {
  //       autoFocus: false,
  //       onFocus: () => {
  //         done() // 触发回调，才能完成该测试
  //       },
  //     },
  //   })
  //   setTimeout(() => {
  //     editor.focus()
  //   }, 500)
  // })

  // it('onBlur', done => {
  //   const editor = createEditor({
  //     config: {
  //       onBlur: () => {
  //         done() // 触发回调，才能完成该测试
  //       },
  //     },
  //   })
  //   setTimeout(() => {
  //     console.log(111, document.activeElement)
  //     editor.blur()
  //   })
  // })
})
