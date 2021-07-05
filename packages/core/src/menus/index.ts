/**
 * @description menus entry
 * @author wangfupeng
 */

import Toolbar from './bar/Toolbar'

// 注册
export { registerMenu } from './register'

// menu 相关接口
export {
  IButtonMenu,
  ISelectMenu,
  IDropPanelMenu,
  IModalMenu,
  IMenuConf,
  IOption,
} from './interface'

// 输出 modal 相关方法
export { genModalInputElems, genModalButtonElems } from './panel-and-modal/Modal'

export { Toolbar }
