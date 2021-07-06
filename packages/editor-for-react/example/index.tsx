/**
 * @description react example
 * @author wangfupeng
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '../src/index'

function App() {
  return (
    <div>
      <Button />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('App'))
