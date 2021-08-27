/**
 * @description toolbar react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import * as wangEditor from '@wangeditor/editor-cattle'

interface IProps {
  editor: wangEditor.IDomEditor | null
  defaultConfig?: Partial<wangEditor.IToolbarConfig>
  mode?: string
}

function ToolbarComponent(props: IProps) {
  const { editor, defaultConfig = {}, mode = 'default' } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return
    if (editor == null) return

    wangEditor.createToolbar({
      editor,
      selector: ref.current,
      config: defaultConfig,
      mode,
    })
  }, [editor])

  return <div ref={ref}></div>
}

export default ToolbarComponent
