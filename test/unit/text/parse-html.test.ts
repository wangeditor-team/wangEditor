/**
 * @description parse html test
 * @author wangfupeng
 */

import parseHtml from '../../../src/text/paste/parse-html'

test('parse html 基本功能', () => {
    const html = `<div><p>文字<a href="xxx">链接</a></p><p><img src="xxx"/></p></div>` // 不要换行
    const newHtml = parseHtml(html)
    expect(newHtml).toBe(html)
})

test('parse html 属性过滤', () => {
    const html = `<div data-a="a">
        <p class="b">文字<a href="xxx">链接</a></p>
        <p><img src="xxx"/></p>
    </div>`
    const newHtml = parseHtml(html)
    expect(newHtml.indexOf('data-a')).toBeLessThan(0)
    expect(newHtml.indexOf('class')).toBeLessThan(0)
    expect(newHtml.indexOf('href')).toBeGreaterThanOrEqual(0)
    expect(newHtml.indexOf('src')).toBeGreaterThanOrEqual(0)
})

test('parse html 过滤样式', () => {
    const html = `<div>
        <p style="color: red;" class="a">文字</p>
    </div>`

    // 默认过滤样式
    const newHtml1 = parseHtml(html)
    expect(newHtml1.indexOf('style')).toBeLessThan(0)
    expect(newHtml1.indexOf('class')).toBeLessThan(0) // 不要 class

    // 不过滤样式
    const newHtml2 = parseHtml(html, false)
    expect(newHtml2.indexOf('style')).toBeGreaterThanOrEqual(0)
    expect(newHtml2.indexOf('class')).toBeLessThan(0) // 不要 class
})

test('parse html 忽略图片', () => {
    const html = `<div>
        <p><img src="xxx"/></p>
    </div>`

    // 默认不忽略图片
    const newHtml1 = parseHtml(html)
    expect(newHtml1.indexOf('img')).toBeGreaterThanOrEqual(0)

    // 忽略图片
    const newHtml2 = parseHtml(html, true, true)
    expect(newHtml2.indexOf('img')).toBeLessThan(0)
})
