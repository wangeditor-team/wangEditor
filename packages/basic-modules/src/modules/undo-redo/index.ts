/**
 * @description undo redo
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { redoMenuConf, undoMenuConf } from './menu/index'

const undoRedo: Partial<IModuleConf> = {
  menus: [redoMenuConf, undoMenuConf],
}

export default undoRedo
