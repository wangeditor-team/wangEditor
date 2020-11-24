import $ from '../../../../src/utils/dom-core'
import { isTodo, getCursorNextNode } from '../../../../src/menus/todo/util'

const todoHtml = `<ul data-todo-key="w-e-text-todo" style="margin:0 0 0 20px;position:relative;"><li style="list-style:none;"><span style="position: absolute;left: -18px;top: 2px;" contenteditable="false"><input type="checkbox" style="margin-right:3px;"></span>1223</li></ul>`
const testNodeTemplate = $(
    `<b><i><span>test132</span><span>232333</span></i><span>12345678</span><span>xxd</span>dddd</b>`
).getNode()

test('test isTodo', () => {
    const todo = $(todoHtml)
    expect(isTodo(todo)).toEqual(true)
})

test('测试文本节点为空的情况', () => {
    const testNode = testNodeTemplate.cloneNode(true)
    const txt = new Text()
    const res = getCursorNextNode(testNode, txt, 3) as Element
    expect(res.outerHTML).toEqual(
        `<b><i><span>test132</span><span>232333</span></i><span>12345678</span><span>xxd</span>dddd</b>`
    )
})

test('测试光标位置在文本节点中间生成截断新节点', () => {
    const testNode = testNodeTemplate.cloneNode(true)
    const txt = $(testNode).childNodes()?.get(0).childNodes()?.getNode(1).childNodes[0] as Node
    // txt 232333
    const res = getCursorNextNode(testNode, txt, 3) as Element
    expect(res.outerHTML).toEqual(
        `<b><i><span>333</span></i><span>12345678</span><span>xxd</span>dddd</b>`
    )
})

test('测试光标位置在文本节点最前面生成截断新节点', () => {
    const testNode = testNodeTemplate.cloneNode(true)
    const txt = $(testNode).childNodes()?.getNode(1).childNodes[0] as Node
    // txt 12345678
    const res = getCursorNextNode(testNode, txt, 0) as Element
    expect(res.outerHTML).toEqual(`<b><span>12345678</span><span>xxd</span>dddd</b>`)
})

test('测试光标位置在文本节点最后面生成截断新节点', () => {
    const testNode = testNodeTemplate.cloneNode(true)
    const txt = $(testNode).childNodes()?.getNode(1).childNodes[0] as Node
    // txt 12345678
    const res = getCursorNextNode(testNode, txt, 8) as Element
    expect(res.outerHTML).toEqual(`<b><span>xxd</span>dddd</b>`)
})
