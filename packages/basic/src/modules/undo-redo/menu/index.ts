/**
 * @description menu entry
 * @author wangfupeng
 */

import RedoMenu from './RedoMenu'
import UndoMenu from './UndoMenu'

export const undoMenuConf = {
  key: 'undo',
  factory() {
    return new UndoMenu()
  },
}

export const redoMenuConf = {
  key: 'redo',
  factory() {
    return new RedoMenu()
  },
}
