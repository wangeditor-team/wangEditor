/**
 * @description component demo
 * @author wangfupeng
 */

import React, { useState } from 'react'
import wangEditor from '@wangeditor/editor'

function Button() {
  let [num, setNum] = useState<number>(1)

  return (
    <div>
      <span>wangEditor props {`${Object.keys(wangEditor)}`}</span>
      <button onClick={() => setNum(++num)}>{num}</button>
    </div>
  )
}

export default Button
