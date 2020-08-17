/**
 * @description 编辑器配置
 * @author wangfupeng
 */

import menusConfig, { EmotionsType } from './menus'
import eventsConfig from './events'
import styleConfig from './style'
import pasteConfig from './paste'
import cmdConfig from './cmd'
import imageConfig, { UploadImageHooksType } from './image'
import textConfig from './text'
import langConfig from './lang'
import linkCheckConfig from './linkCheck'
import linkImgCheckConfig from './linkImgCheck'

// 字典类型
export type DicType = {
    [key: string]: string
}

// 定义配置项的类型规范
export type ConfigType = {
    menus: string[]
    fontNames: string[]
    fontSizes: DicType
    customFontSize: customFontSizeType
    colors: string[]
    emotions: EmotionsType[]
    zIndex: number
    onchange: Function
    onfocus: Function
    onblur: Function
    onchangeTimeout: number
    pasteFilterStyle: boolean
    pasteIgnoreImg: boolean
    pasteTextHandle: Function
    styleWithCSS: boolean
    linkImgCallback: Function

    placeholder: string
    showLinkImg: boolean
    uploadImgServer: string
    uploadImgShowBase64: boolean
    uploadImgMaxSize: number
    uploadImgMaxLength: number
    uploadFileName: string
    uploadImgParams: DicType
    uploadImgParamsWithUrl: boolean
    uploadImgHeaders: DicType
    uploadImgHooks: UploadImageHooksType
    uploadImgTimeout: number
    withCredentials: boolean
    customUploadImg: Function | null
    customAlert: Function | null

    lang: string
    languages: Resource

    linkCheck: Function
    linkImgCheck: Function
}

export type Resource = {
    [language: string]: ResourceLanguage
}

export type ResourceLanguage = {
    [namespace: string]: ResourceKey
}

export type ResourceKey =
    | string
    | {
          [key: string]: any
      }

export type customFontSizeType = Array<{ value: string; text: string }>
// 合并所有的配置信息
const defaultConfig = Object.assign(
    {},
    menusConfig,
    eventsConfig,
    styleConfig,
    cmdConfig,
    pasteConfig,
    imageConfig,
    textConfig,
    langConfig,
    linkCheckConfig,
    linkImgCheckConfig
)

export default defaultConfig
