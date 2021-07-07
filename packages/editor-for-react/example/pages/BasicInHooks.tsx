/**
 * @description basic demo
 * @author wangfupeng
 */

import React, { useState, useEffect } from 'react'
import { IDomEditor, IEditorConfig, SlateDescendant } from '@wangeditor/editor'
import Editor from '../../src/components/Editor'
import Toolbar from '../../src/components/Toolbar'

function Basic() {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [content, setContent] = useState<SlateDescendant[]>([])

  // ----------------------- editor config -----------------------
  const editorConfig: Partial<IEditorConfig> = {}
  editorConfig.placeholder = '请输入内容...'
  editorConfig.onCreated = (editor: IDomEditor) => {
    setEditor(editor)
  }
  editorConfig.onChange = (editor: IDomEditor) => {
    setContent(editor.children)
  }
  editorConfig.MENU_CONF = {}
  editorConfig.MENU_CONF['uploadImage'] = {
    server: 'http://106.12.198.214:3000/api/upload-img', // 上传图片地址
    fieldName: 'react-hooks-demo-fileName',
  }
  // 继续补充其他配置~

  // ----------------------- 修改配置，使用 API -----------------------
  function toggleReadOnly() {
    if (editor == null) return
    editor.setConfig({
      readOnly: !editor.getConfig().readOnly,
    })
  }
  function printHtml() {
    if (editor == null) return
    console.log(editor.getHtml())
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
      <div>
        Basic usage in hooks component &nbsp;
        <button onClick={toggleReadOnly}>切换 readOnly</button>
        &nbsp;
        <button onClick={printHtml}>打印 html</button>
      </div>

      <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
        {/* 渲染 toolbar */}
        <Toolbar editor={editor} />
      </div>

      {/* 分割线 */}
      <div style={{ height: '10px' }}></div>

      <div style={{ border: '1px solid #ccc' }}>
        {/* 渲染 editor */}
        <Editor config={editorConfig} />
      </div>

      <div style={{ border: '1px solid #ccc', marginTop: '20px' }}>
        <textarea
          readOnly
          style={{ width: '100%', height: '300px' }}
          value={JSON.stringify(content, null, 4)}
        ></textarea>
      </div>
    </React.Fragment>
  )
}

export default Basic
