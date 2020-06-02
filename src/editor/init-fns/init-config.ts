/**
 * @description 初始化编辑器配置
 * @author wangfupeng
 */

import Editor from '../index'
import defaultConfig from '../config'

export default function (editor: Editor): void {
    // 自定义配置和默认配置，合并
    editor.config = Object.assign({}, defaultConfig, editor.customConfig)

    // 原先版本中，此处有多语言配置
}
