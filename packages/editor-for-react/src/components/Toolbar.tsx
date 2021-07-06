/**
 * @description toolbar react component
 * @author wangfupeng
 */

import React, { useState, useRef, useEffect } from 'react'
import wangEditor, { IToolbarConfig, IDomEditor } from '@wangeditor/editor'

interface IProps {
  editor: IDomEditor | null
  config?: Partial<IToolbarConfig>
}

function ToolbarComponent(props: IProps) {
  const { editor, config = {} } = props

  // TODO 根据 props 触发组件 update

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return
    if (editor == null) return

    wangEditor.createToolbar({
      editor,
      toolbarSelector: ref.current,
      config,
    })
  }, [editor])

  // TODO 组件销毁时？

  return <div ref={ref}></div>
}

export default ToolbarComponent
