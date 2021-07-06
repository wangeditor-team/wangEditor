/**
 * @description react example
 * @author wangfupeng
 */

import '@wangeditor/editor/dist/css/style.css'

import React from 'react'
import ReactDOM from 'react-dom'
import Basic from './pages/Basic'

function App() {
  return (
    <div style={{ margin: '0 20px' }}>
      <p>wangEditor react demo</p>

      <Basic />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('App'))
