/**
 * @description quote test
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import createQuote from '../../../src/menus/quote/create-quote-node'
import $, { DomElement } from '../../../src/utils/dom-core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let editor: Editor

test('单行引用', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    const $childElem: DomElement[] = [$(`<p>123</p>`)]
    const $quote = createQuote($childElem)
    const p = $(`<p></p>`)
    p.append($quote)
    expect(p.html()).toEqual(`<blockquote><p>123</p></blockquote>`)
})

test('多行引用', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    const $childElem: DomElement[] = [$(`<p>123</p>`), $(`<p>456</p>`)]
    const $quote = createQuote($childElem)
    const p = $(`<p></p>`)
    p.append($quote)
    expect(p.html()).toEqual(`<blockquote><p>123</p><p>456</p></blockquote>`)
})
