/**
 * @description 选区范围
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import Selection from '../../../src/editor/selection'
import $, { DomElement } from '../../../src/utils/dom-core'

const TEXT = '我是一行文字'
const $SPAN = $(`<span>${TEXT}</span>`)
const $P = $('<p></p>')
$P.append($SPAN)

let SELECTION_INSTANCE: Selection
let RANGE: Range | null | undefined

test('初始化 selection 实例', () => {
    const editor = createEditor(document, 'div1')
    editor.$textElem.append($P)
    const selection = editor.selection
    SELECTION_INSTANCE = selection // 赋值给全局变量
    expect(selection).not.toBeNull()
})

test('保存选区', () => {
    SELECTION_INSTANCE.saveRange()
    RANGE = SELECTION_INSTANCE.getRange()
    expect(RANGE).not.toBeNull()
})

// 注意，如果创建选区，然后再执行“保存选区”，会出错，所以顺序不要乱：先测试保存选区，再测试创建选区
test('通过元素创建选区', () => {
    SELECTION_INSTANCE.createRangeByElem($SPAN) // 选中 span
    RANGE = SELECTION_INSTANCE.getRange()
    expect(RANGE).not.toBeNull()
})

test('恢复选区', () => {
    SELECTION_INSTANCE.restoreSelection()
    RANGE = SELECTION_INSTANCE.getRange()
    expect(RANGE).not.toBeNull()
})

test('获取选区文字', () => {
    const rangeText = SELECTION_INSTANCE.getSelectionText()
    expect(rangeText).toBe(TEXT)
})

test('选区是否为空', () => {
    const isEmpty = SELECTION_INSTANCE.isSelectionEmpty()
    expect(isEmpty).toBe(false)
})

test('获取选区 DOM', () => {
    const $container = SELECTION_INSTANCE.getSelectionContainerElem() as DomElement // p 标签
    expect($container.text()).toBe(TEXT)
    const $start = SELECTION_INSTANCE.getSelectionStartElem() as DomElement // p 标签
    expect($start.text()).toBe(TEXT)
    const $end = SELECTION_INSTANCE.getSelectionEndElem() as DomElement // p 标签
    expect($end.text()).toBe(TEXT)
})

test('折叠选区', () => {
    if (RANGE == null) throw new Error('RANGE is null')
    expect(RANGE.collapsed).toBe(false)
    SELECTION_INSTANCE.collapseRange()
    expect(RANGE.collapsed).toBe(true)
})

test('创建空白选区（必须是折叠的选区范围）', () => {
    SELECTION_INSTANCE.createEmptyRange()
    RANGE = SELECTION_INSTANCE.getRange() as Range
    expect(SELECTION_INSTANCE.getSelectionText()).toBe('')
    expect(RANGE.collapsed).toBe(true)
})
