/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import wangEditor, { SlateDescendant, IEditorConfig } from '@wangeditor/editor'

interface IProps {
  defaultContent: SlateDescendant[]
  defaultConfig: Partial<IEditorConfig>
}

function EditorComponent(props: Partial<IProps>) {
  const { defaultContent = [], defaultConfig = {} } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return

    wangEditor.createEditor({
      textareaSelector: ref.current,
      config: defaultConfig,
      content: defaultContent,
    })
  }, [])

  return <div ref={ref}></div>
}

export default EditorComponent
