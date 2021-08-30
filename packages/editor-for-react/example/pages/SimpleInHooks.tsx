/**
 * @description simple demo
 * @author wangfupeng
 */

import React, { useState, useEffect } from 'react'
import { IDomEditor, IEditorConfig } from '@wangeditor/editor-cattle'
import { Editor, Toolbar } from '../../src/index'

function Basic() {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // ----------------------- editor config -----------------------
  const editorConfig: Partial<IEditorConfig> = {}
  editorConfig.placeholder = '请输入内容...'
  editorConfig.onCreated = (editor: IDomEditor) => {
    setEditor(editor)
  }
  // 继续补充其他配置~

  // ----------------------- editor content -----------------------
  const defaultContent = [
    { type: 'paragraph', children: [{ text: 'class 组件 - 精简模式' }] },
    { type: 'paragraph', children: [{ text: '简化 toolbar 和 hoverbar' }] },
    { type: 'paragraph', children: [{ text: '' }] },
  ]

  // ----------------------- toolbar config -----------------------
  const toolbarConfig = {
    // 工具栏配置
  }

  // ----------------------- 销毁 editor -----------------------
  useEffect(() => {
    // 组件销毁时，销毁 editor
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <React.Fragment>
      <div style={{ border: '1px solid #ccc' }}>
        {/* 渲染 toolbar */}
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="simple" />
      </div>

      <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
        {/* 渲染 editor */}
        <Editor
          defaultConfig={editorConfig}
          defaultContent={defaultContent}
          mode="simple"
          style={{ height: '500px' }}
        />
      </div>
    </React.Fragment>
  )
}

export default Basic
