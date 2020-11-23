/**
 * @description 事件配置
 * @author wangfupeng
 */

import { EMPTY_FN } from '../utils/const'

export type TCatalog = {
    tag: string
    id: string
    text: string
}

/**
 * 提示信息
 * @param alertInfo alert info
 * @param statusType 状态码
 * @param debugInfo debug info
 */
function customAlert(alertInfo: string, statusType: string, debugInfo?: string): void {
    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
    window.alert(alertInfo)
    if (debugInfo) {
        console.error('wangEditor: ' + debugInfo)
    }
}

export default {
    onchangeTimeout: 200,

    onchange: EMPTY_FN,
    onfocus: EMPTY_FN,
    onblur: EMPTY_FN,

    onCatalogChange: null,
    customAlert,
}
