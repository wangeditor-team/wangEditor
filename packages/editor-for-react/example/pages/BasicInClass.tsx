/**
 * @description basic demo
 * @author wangfupeng
 */

import React, { Component } from 'react'
import { IDomEditor, IEditorConfig, SlateDescendant } from '@wangeditor/editor'
import Editor from '../../src/components/Editor'
import Toolbar from '../../src/components/Toolbar'

interface IState {
  editor: IDomEditor | null
  curContent: SlateDescendant[]
}

class Basic extends Component {
  state: IState = {
    editor: null,
    curContent: [],
  }

  constructor(props) {
    super(props)
  }

  // ----------------------- 修改配置，使用 API -----------------------
  toggleReadOnly() {
    const { editor } = this.state
    if (editor == null) return
    editor.setConfig({
      readOnly: !editor.getConfig().readOnly,
    })
  }
  printHtml() {
    const { editor } = this.state
    if (editor == null) return
    console.log(editor.getHtml())
  }

  render() {
    // ----------------------- editor config -----------------------
    const editorConfig: Partial<IEditorConfig> = {}
    editorConfig.placeholder = '请输入内容...'
    editorConfig.onCreated = (editor: IDomEditor) => {
      this.setState({ editor })
    }
    editorConfig.onChange = (editor: IDomEditor) => {
      this.setState({ curContent: editor.children })
    }
    editorConfig.MENU_CONF = {}
    editorConfig.MENU_CONF['uploadImage'] = {
      server: 'http://106.12.198.214:3000/api/upload-img', // 上传图片地址
      fieldName: 'react-hooks-demo-fileName',
    }
    // 继续补充其他配置~

    // ----------------------- editor content -----------------------
    const defaultContent = [
      { type: 'paragraph', children: [{ text: 'class 组件 - 基本使用' }] },
      { type: 'paragraph', children: [{ text: '' }] },
    ]

    // ----------------------- toolbar config -----------------------
    const toolbarConfig = {
      // 可配置 toolbarKeys: [...]
    }

    return (
      <React.Fragment>
        <div>
          Basic usage in class component &nbsp;
          <button onClick={this.toggleReadOnly.bind(this)}>切换 readOnly</button>
          &nbsp;
          <button onClick={this.printHtml.bind(this)}>打印 html</button>
        </div>

        <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
          {/* 渲染 toolbar */}
          <Toolbar editor={this.state.editor} defaultConfig={toolbarConfig} />
        </div>

        <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
          {/* 渲染 editor */}
          <Editor defaultConfig={editorConfig} defaultContent={defaultContent} />
        </div>

        <div style={{ border: '1px solid #ccc', marginTop: '20px' }}>
          <textarea
            readOnly
            style={{ width: '100%', height: '300px' }}
            value={JSON.stringify(this.state.curContent, null, 4)}
          ></textarea>
        </div>
      </React.Fragment>
    )
  }

  componentWillUnmount() {
    // ----------------------- 销毁 editor -----------------------
    const { editor } = this.state
    if (editor == null) return
    editor.destroy()
    this.setState({ editor: null })
  }
}

export default Basic
