/**
 * @author 翠林
 * @deprecated 生成颜色列表的 HTML 结构
 */

import { ColorData, ColorGroup } from '../../types'

/**
 * 生成单独一组颜色的 HTML
 * @param colors 颜色集合（一维数组）
 */
export function colorGroupTPL(colors: ColorGroup) {
    const doms = colors.map(
        color => `<i class="we-color" style="background-color: ${color};" color="${color}"></i>`
    )
    return `<div class="we-color-group">${doms.join('')}</div>`
}

/**
 * 某一组颜色为空时，返回对应的消息提示
 * @param text 提示文字
 */
export function emptyGroupTPL(text: string) {
    return `<span class="color-list-null">${text}</span>`
}

/**
 * 生成完整的颜色集合 HTML
 * @param colors 颜色集合
 * @param title 颜色集合对应的 Title
 * @param empty 集合为空时的提示信息
 */
export default function colorTPL(colors: ColorData, title: string, empty: string) {
    const doms = []
    if (colors.length) {
        if (Array.isArray(colors[0])) {
            ;(colors as ColorGroup[]).forEach(group => {
                doms.push(colorGroupTPL(group))
            })
        } else {
            doms.push(colorGroupTPL(colors as ColorGroup))
        }
    } else {
        doms.push(emptyGroupTPL(empty))
    }
    return `
<fieldset class="we-selection">
    <legend class="we-selection-title">${title}</legend>
    <div class="we-selection-main">${doms.join('')}</div>
</fieldset>`
}
