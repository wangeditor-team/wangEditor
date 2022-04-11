/**
 * @description parse-html helper fns
 * @author wangfupeng
 */

const REPLACE_SPACE_160_REG = new RegExp(String.fromCharCode(160), 'g')

/**
 * 把 charCode 160 的空格（`&nbsp` 转换的），替换为 charCode 32 的空格（JS 默认的）
 * @param str str
 * @returns str
 */
export function replaceSpace160(str: string): string {
  const res = str.replace(REPLACE_SPACE_160_REG, ' ')
  return res
}
