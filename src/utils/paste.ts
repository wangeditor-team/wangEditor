/**
 * @description 处理粘贴逻辑
 * @author wangfupeng
 */

import { replaceHtmlSymbol, forEach } from './util'

/**
 * 获取粘贴的纯文本
 * @param e Event 参数
 */
export function getPasteText(e: ClipboardEvent): string {
    // const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
    const clipboardData = e.clipboardData // 咱不考虑 originalEvent 的情况
    let pasteText
    if (clipboardData == null) {
        pasteText = (window as any).clipboardData && (window as any).clipboardData.getData('text')
    } else {
        pasteText = clipboardData.getData('text/plain')
    }
    return replaceHtmlSymbol(pasteText)
}

/**
 * 获取粘贴的 html 字符串
 * @param e Event 参数
 * @param filterStyle 是否过滤 style 样式
 * @param ignoreImg 是否忽略 img 标签
 */
export function getPasteHtml(
    e: ClipboardEvent,
    filterStyle: boolean = false,
    ignoreImg: boolean = false
): string {
    console.log(e, filterStyle, ignoreImg)
    return ''
}

/**
 * 获取粘贴的图片文件
 * @param e Event 参数
 */
export function getPasteImgs(e: ClipboardEvent): any[] {
    const result = []
    const txt = getPasteText(e)
    if (txt) {
        // 有文字，就忽略图片
        return result
    }

    const clipboardData = e.clipboardData
    const items = clipboardData.items
    if (!items) {
        return result
    }

    forEach(items, (key, value) => {
        const type = value.type
        if (/image/i.test(type)) {
            result.push(value.getAsFile())
        }
    })

    return result
}
