/**
 * @description editor react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import * as wangEditor from '@wangeditor/editor-cattle'

interface IProps {
  defaultContent: wangEditor.SlateDescendant[]
  defaultConfig: Partial<wangEditor.IEditorConfig>
  mode?: string
}

function EditorComponent(props: Partial<IProps>) {
  const { defaultContent = [], defaultConfig = {}, mode = 'default' } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return

    wangEditor.createEditor({
      selector: ref.current,
      config: defaultConfig,
      content: defaultContent,
      mode,
    })
  }, [])

  return <div ref={ref}></div>
}

export default EditorComponent
