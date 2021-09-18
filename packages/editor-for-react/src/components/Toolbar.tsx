/**
 * @description toolbar react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import * as wangEditor from '@wangeditor/editor'

interface IProps {
  editor: wangEditor.IDomEditor | null
  defaultConfig?: Partial<wangEditor.IToolbarConfig>
  mode?: string
  style?: object
}

function ToolbarComponent(props: IProps) {
  const { editor, defaultConfig = {}, mode = 'default', style = {} } = props
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

  return <div style={style} ref={ref}></div>
}

export default ToolbarComponent
