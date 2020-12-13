/**
 * @description 编辑器配置
 * @author wangfupeng
 */

import menusConfig, { EmotionsType, FontSizeConfType, IndentationType } from './menus'
import eventsConfig from './events'
import styleConfig from './style'
import pasteConfig from './paste'
import cmdConfig from './cmd'
import imageConfig, { UploadImageHooksType } from './image'
import textConfig from './text'
import langConfig from './lang'
import historyConfig from './history'
import videoConfig from './video'

// 字典类型
export type DicType = {
    [key: string]: string
}

// 定义配置项的类型规范
export type ConfigType = {
    height: number
    languageType: string[]
    languageTab: string
    menus: string[]
    excludeMenus: string[]
    fontNames: string[]
    lineHeights: string[]
    indentation: IndentationType
    fontSizes: FontSizeConfType
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
    zIndexFullScreen: number
    showFullScreen: boolean
    showLinkImg: boolean
    uploadImgAccept: string[]
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
    customAlert: Function

    onCatalogChange: Function | null

    lang: string
    languages: typeof langConfig

    linkCheck: Function
    linkImgCheck: Function
    compatibleMode: () => boolean
    historyMaxSize: number

    focus: boolean

    onlineVideoCheck: Function
    onlineVideoCallback: Function
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
    historyConfig,
    videoConfig,
    //链接校验的配置函数
    {
        linkCheck: function (text: string, link: string): string | boolean {
            return true
        },
    },
    //网络图片校验的配置函数
    {
        linkImgCheck: function (src: string): string | boolean {
            return true
        },
    }
)

export default defaultConfig
