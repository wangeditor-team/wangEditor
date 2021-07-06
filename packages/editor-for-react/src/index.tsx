/**
 * @description editor-for-react entry
 * @author wangfupeng
 */

import React from 'react'
import ReactDOM from 'react-dom'
import wangEditor from '@wangeditor/editor'

const Hello: React.FC = () => {
  return <div>hello</div>
}

console.log(wangEditor)

ReactDOM.render(<Hello />, document.getElementById('App'))
