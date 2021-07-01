/**
 * @description module node helpers
 * @author wangfupeng
 */

/**
 * 根据 node.type 获取 html tag
 * @param type node.type
 */
export function genTag(type: string): string {
  if (type === 'bulleted-list') return 'ul'
  if (type === 'numbered-list') return 'ol'
  if (type === 'list-item') return 'li'
  throw new Error(`list type '${type}' is invalid`)
}
