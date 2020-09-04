/**
 * @description polyfill 【注意，js 语法的兼容，都通过 babel transform runtime 支持】
 * @author wangfupeng
 */

if (!Element.prototype.matches) {
    Element.prototype.matches = function (s) {
        let matches: NodeListOf<Element> = this.ownerDocument.querySelectorAll(s)
        let i: number = matches.length
        for (i; i >= 0; i--) {
            if (matches.item(i) === this) break
        }
        return i > -1
    }
}
