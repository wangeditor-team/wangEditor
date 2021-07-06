/**
 * @description basic demo
 * @author wangfupeng
 */

import React, { useState } from 'react'
import { IDomEditor, IEditorConfig, SlateDescendant } from '@wangeditor/editor'
import Editor from '../../src/components/Editor'
import Toolbar from '../../src/components/Toolbar'

function Basic() {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [content, setContent] = useState<SlateDescendant[]>([])

  // editor config
  const editorConfig: Partial<IEditorConfig> = {}
  editorConfig.placeholder = '请输入内容...'
  editorConfig.onCreated = (editor: IDomEditor) => {
    setEditor(editor)
  }
  editorConfig.onChange = (editor: IDomEditor) => {
    setContent(editor.children)
  }
  // TODO 继续补充其他配置~

  return (
    <React.Fragment>
      <div style={{ border: '1px solid #ccc' }}>
        {/* 渲染 toolbar */}
        <Toolbar editor={editor} />
      </div>

      <div style={{ height: '10px' }}>{/* 分割线 */}</div>

      <div style={{ border: '1px solid #ccc' }}>
        {/* 渲染 editor */}
        <Editor config={editorConfig} />
      </div>

      <div style={{ border: '1px solid #ccc', marginTop: '20px' }}>
        <textarea
          readOnly
          style={{ width: '100%', height: '300px' }}
          value={JSON.stringify(content, null, 2)}
        ></textarea>
      </div>
    </React.Fragment>
  )
}

export default Basic
