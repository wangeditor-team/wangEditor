/**
 * @description 图片菜单配置
 * @author wangfupeng
 */

export function genImageMenuConfig() {
  return {
    /**
     * 插入图片之后的回调
     * @param src image src
     * @param alt image alt
     * @param url image url
     */
    onInsertedImage(src: string, alt: string, url: string) {
      /*自定义*/
    },

    /**
     * 检查图片信息
     * @param src image src
     * @param alt image alt
     * @param url image url
     */
    checkImage(src: string, alt: string, url: string): boolean | string | undefined {
      // 1. 返回 true ，说明检查通过
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止图片插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止图片插入
      return true
    },

    /**
     * 更新图片之后的回调
     * @param src image src
     * @param alt image alt
     * @param url image url
     */
    onUpdatedImage(src: string, alt: string, url: string) {
      /*自定义*/
    },

    // TODO onDeletedImage ？？？ 考虑所有删除的场景 —— 可以使用插件，劫持 e.apply 中的 `remove_node`
  }
}
