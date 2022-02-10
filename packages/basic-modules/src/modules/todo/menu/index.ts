/**
 * @description todo menu entry
 * @author wangfupeng
 */

import TodoMenu from './Todo'

export const todoMenuConf = {
  key: 'todo',
  factory() {
    return new TodoMenu()
  },
}
