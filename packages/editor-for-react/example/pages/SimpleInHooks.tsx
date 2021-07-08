/**
 * @description simple demo
 * @author wangfupeng
 */

import React, { useState, useEffect } from 'react'
import { IDomEditor, IEditorConfig, SlateDescendant } from '@wangeditor/editor'
import Editor from '../../src/components/Editor'
import Toolbar from '../../src/components/Toolbar'

function Basic() {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // ----------------------- editor config -----------------------
  const editorConfig: Partial<IEditorConfig> = {}
  editorConfig.placeholder = '请输入内容...'
  editorConfig.hoverbarKeys = []
  editorConfig.onCreated = (editor: IDomEditor) => {
    setEditor(editor)
  }
  // 继续补充其他配置~

  // ----------------------- editor content -----------------------
  const defaultContent = [
    { type: 'paragraph', children: [{ text: 'class 组件 - 精简模式' }] },
    { type: 'paragraph', children: [{ text: '简化 toolbar ，禁用 hoverbar' }] },
    { type: 'paragraph', children: [{ text: '' }] },
  ]

  // ----------------------- toolbar config -----------------------
  const toolbarConfig = {
    toolbarKeys: [
      'bold',
      'italic',
      'underline',
      'code',
      '|',
      'header1',
      'header2',
      'blockquote',
      '|',
      'bulletedList',
      'numberedList',
    ],
  }

  // ----------------------- 销毁 editor -----------------------
  useEffect(() => {
    // 组件销毁时，销毁 editor
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [])

  return (
    <React.Fragment>
      <div style={{ border: '1px solid #ccc' }}>
        {/* 渲染 toolbar */}
        <Toolbar editor={editor} defaultConfig={toolbarConfig} />
      </div>

      <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
        {/* 渲染 editor */}
        <Editor defaultConfig={editorConfig} defaultContent={defaultContent} />
      </div>
    </React.Fragment>
  )
}

export default Basic
