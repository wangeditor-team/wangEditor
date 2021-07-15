/**
 * @description set default config
 * @author wangfupeng
 */

import Boot from '../Boot'
import {
  getDefaultEditorConfig,
  getDefaultToolbarConfig,
  getSimpleEditorConfig,
  getSimpleToolbarConfig,
} from './config'

import { wangEditorCodeHighLightDecorate } from '@wangeditor/code-highlight'

const defaultEditorConfig = getDefaultEditorConfig()
Boot.setEditorConfig({
  ...defaultEditorConfig,
  decorate: wangEditorCodeHighLightDecorate, // 代码高亮
})

const simpleEditorConfig = getSimpleEditorConfig()
Boot.setSimpleEditorConfig({
  ...simpleEditorConfig,
  decorate: wangEditorCodeHighLightDecorate, // 代码高亮
})

const defaultToolbarConfig = getDefaultToolbarConfig()
Boot.setToolbarConfig(defaultToolbarConfig)

const simpleToolbarConfig = getSimpleToolbarConfig()
Boot.setSimpleToolbarConfig(simpleToolbarConfig)
