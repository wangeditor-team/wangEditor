/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import wangEditor, { SlateDescendant, IEditorConfig } from '@wangeditor/editor'

interface IProps {
  initContent: SlateDescendant[]
  config: Partial<IEditorConfig>
}

function EditorComponent(props: Partial<IProps>) {
  const { initContent = [], config = {} } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return

    wangEditor.createEditor({
      textareaSelector: ref.current,
      config,
      initContent,
    })
  }, [])

  return <div ref={ref}></div>
}

export default EditorComponent
