import ierange from './util/ierange.js'
import Editor from './editor/index.js'

// 兼容 IE 的 Range 和 Selection 的 API
ierange()

// 将 css 代码添加到 <style> 中
function createStyle(cssContent) {
    var style
    if (document.all) {
        window.style = cssContent
        document.createStyleSheet('javascript:style')
    } else {
        style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML= cssContent
        document.getElementsByTagName('HEAD').item(0).appendChild(style)
    }
}
// 这里的 `inlinecss` 将被替换成 css 代码的内容，详情可去 ./gulpfile.js 中搜索 `inlinecss` 关键字
const inlinecss = '__INLINE_CSS__'
createStyle(inlinecss)

// 返回
export default (window.wangEditor || Editor)