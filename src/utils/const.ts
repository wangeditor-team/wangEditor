/**
 * @description 常量
 * @author wangfupeng
 */

export function EMPTY_FN() {}

//用于校验是否为url格式字符串
export const urlRegex = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/

/**
 * 用于校验是否为颜色格式字符串
 */
// eslint-disable-next-line no-useless-escape
export const colorRegex = /^(\#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})|(rgb|RGB)\(\d{1,3},\s{0,}\d{1,3},\s{0,}\d{1,3}\)|(rgba|RGBA)\(\d{1,3},\s{0,}\d{1,3},\s{0,}\d{1,3},\s{0,}([01]|0?\.\d+)\))$/

/**
 * 用于校验是否为 hex 颜色
 */
// eslint-disable-next-line no-useless-escape
export const hexRegex = /^\#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

/**
 * 用于校验是否为 rgb 颜色
 */
export const rgbRegex = /^((rgb|RGB)\(\d{1,3},\s{0,}\d{1,3},\s{0,}\d{1,3}\)|(rgba|RGBA)\(\d{1,3},\s{0,}\d{1,3},\s{0,}\d{1,3},\s{0,}([01]|0?\.\d+)\))$/
