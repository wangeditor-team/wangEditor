/**
 * @description code-block menu
 * @author wangfupeng
 */

import CodeBlockMenu from './CodeBlockMenu'

export const codeBlockMenuConf = {
  key: 'codeBlock',
  factory() {
    return new CodeBlockMenu()
  },
}
