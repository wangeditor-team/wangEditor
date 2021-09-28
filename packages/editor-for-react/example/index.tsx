/**
 * @description react example
 * @author wangfupeng
 */

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import BasicInHooks from './pages/BasicInHooks'
import BasicInClass from './pages/BasicInClass'
import SimpleInHooks from './pages/SimpleInHooks'

function App() {
  const [pageName, setPageName] = useState('')

  return (
    <div style={{ margin: '20px' }}>
      {/* 选择显示哪个 demo 页 */}
      <button onClick={() => setPageName('')}>clear</button>
      &nbsp;
      <button onClick={() => setPageName('simple-in-hooks')}>simple-in-hooks</button>
      &nbsp;
      <button onClick={() => setPageName('basic-in-hooks')}>basic-in-hooks</button>
      &nbsp;
      <button onClick={() => setPageName('basic-in-class')}>basic-in-class</button>
      <hr />
      {/* 按条件显示 demo 页 */}
      {pageName === 'basic-in-hooks' && <BasicInHooks />}
      {pageName === 'basic-in-class' && <BasicInClass />}
      {pageName === 'simple-in-hooks' && <SimpleInHooks />}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('App'))
