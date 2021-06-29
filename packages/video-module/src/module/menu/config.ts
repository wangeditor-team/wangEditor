/**
 * @description video menu config
 * @author wangfupeng
 */

export function genMenuConfig() {
  return {
    onInsertedVideo(src: string) {
      // 插入视频之后的 callback
    },
    checkVideo(src: string): boolean | string | undefined {
      // 1. 返回 true ，说明检查通过
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入
      return true
    },
  }
}
