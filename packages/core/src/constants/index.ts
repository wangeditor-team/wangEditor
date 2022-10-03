export const IGNORE_TAGS = new Set([
  'doctype',
  '!doctype',
  'meta',
  'script',
  'style',
  'link',
  'frame',
  'iframe',
  'title',
  'svg', // TODO 暂时忽略
])
