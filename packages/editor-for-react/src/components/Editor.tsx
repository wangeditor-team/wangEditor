/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import * as wangEditor from '@wangeditor/editor-cattle'
import { createEditor, SlateDescendant, IEditorConfig } from '@wangeditor/editor-cattle'

interface IProps {
  defaultContent: SlateDescendant[]
  defaultConfig: Partial<IEditorConfig>
  mode?: string
}

function EditorComponent(props: Partial<IProps>) {
  const { defaultContent = [], defaultConfig = {}, mode = 'default' } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return

    // TODO 这里为何不能直接用 createEditor ？
    wangEditor.createEditor({
      textareaSelector: ref.current,
      config: defaultConfig,
      content: defaultContent,
      mode,
    })
  }, [])

  return <div ref={ref}></div>
}

export default EditorComponent
