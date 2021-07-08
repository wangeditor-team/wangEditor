/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import wangEditor, { SlateDescendant, IEditorConfig } from '@wangeditor/editor'

interface IProps {
  initContent: SlateDescendant[]
  defaultConfig: Partial<IEditorConfig>
}

function EditorComponent(props: Partial<IProps>) {
  const { initContent = [], defaultConfig = {} } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return

    wangEditor.createEditor({
      textareaSelector: ref.current,
      config: defaultConfig,
      initContent,
    })
  }, [])

  return <div ref={ref}></div>
}

export default EditorComponent
