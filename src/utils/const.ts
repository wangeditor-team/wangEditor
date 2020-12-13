/**
 * @description 常量
 * @author wangfupeng
 */

export function EMPTY_FN() {}
//用于校验图片链接是否符合规范
export const imgRegex = /\.(gif|jpg|jpeg|png)$/i

//用于校验是否为url格式字符串
export const urlRegex = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/

//用于校验在线视频是否符合规范
export const videoRegex = /((<iframe|video|embed|object)\s+[\s\S]*<\/(iframe|video|embed|object))>|<(iframe|video|embed|object)\s+[\s\S]*\/?>/
