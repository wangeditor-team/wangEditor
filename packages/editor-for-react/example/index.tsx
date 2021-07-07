/**
 * @description react example
 * @author wangfupeng
 */

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import BasicInHooks from './pages/BasicInHooks'
import BasicInClass from './pages/BasicInClass'

function App() {
  const [pageName, setPageName] = useState('')

  return (
    <div style={{ margin: '20px' }}>
      {/* 选择显示哪个 demo 页 */}
      选择要显示的 demo 页 &nbsp;
      <select value={pageName} onChange={e => setPageName(e.target.value)}>
        <option value="">置空</option>
        <option value="basic-in-hooks">basic-in-hooks</option>
        <option value="basic-in-class">basic-in-class</option>
      </select>
      <hr />
      {/* 按条件显示 demo 页 */}
      {pageName === 'basic-in-hooks' && <BasicInHooks />}
      {pageName === 'basic-in-class' && <BasicInClass />}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('App'))
