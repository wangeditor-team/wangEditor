/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useState, useRef, useEffect } from 'react'
import wangEditor, { IDomEditor, SlateDescendant, IEditorConfig } from '@wangeditor/editor'

interface IProps {
  initContent: SlateDescendant[]
  config: Partial<{
    placeholder: string
    onCreated: (editor: IDomEditor) => void
    onChange: (editor: IDomEditor) => void
    onDestroyed: (editor: IDomEditor) => void
  }>
}

function EditorComponent(props: Partial<IProps>) {
  const { initContent = [], config = {} } = props
  const { placeholder, onCreated, onChange, onDestroyed } = config

  // TODO 根据 props 触发组件 update
  // TODO 使用 useMemo useCallback

  const ref = useRef<HTMLDivElement>(null)
  // const [editor, setEditor] = useState<IDomEditor | null>(null)

  const editorConfig: Partial<IEditorConfig> = {}
  if (placeholder) editorConfig.placeholder = placeholder
  if (onCreated) editorConfig.onCreated = onCreated
  if (onChange) editorConfig.onChange = onChange
  if (onDestroyed) editorConfig.onDestroyed = onDestroyed

  useEffect(() => {
    if (ref.current == null) return

    wangEditor.createEditor({
      textareaSelector: ref.current,
      config: editorConfig,
      initContent,
    })
  }, [])

  // TODO 组件销毁时，销毁 editor

  return <div ref={ref}></div>
}

export default EditorComponent
