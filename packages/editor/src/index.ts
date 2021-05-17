/**
 * @description editor index
 * @author wangfupeng
 */

import { Editor } from 'slate'
import core, { fn as fn1 } from '@wangeditor/core'
import basic, { fn as fn2 } from '@wangeditor/basic'

import { add } from './util'

console.log('editor index', Editor)
console.log('add', add(10, 20))

console.log('core', core)
console.log('core fn', fn1())
console.log('basic', basic)
console.log('basic fn', fn2())
