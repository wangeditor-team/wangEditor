import { parseStyleHtml } from '../../src/modules/text-style/parse-style-html'
import $ from '../../src/utils/dom'
import createEditor from '../../../../tests/utils/create-editor'

describe('parse style html', () => {
  const editor = createEditor()

  it('it should return directly if give node that type is not text', () => {
    const element = $('<p></p>')
    const node = { type: 'paragraph', children: [] }
    expect(parseStyleHtml(element[0], node, editor)).toEqual(node)
  })

  it('it should do nothing if give not exist element', () => {
    const element = $('#text')
    const node = { type: 'paragraph', children: [] }
    expect(parseStyleHtml(element[0], node, editor)).toEqual(node)
  })

  it('it should set bold property for node if give strong element', () => {
    const element = $('<strong></strong>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, bold: true })
  })

  it('it should set bold property for node if give b element', () => {
    const element = $('<b></b>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, bold: true })
  })

  it('it should set italic property for node if give i element', () => {
    const element = $('<i></i>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, italic: true })
  })

  it('it should set italic property for node if give em element', () => {
    const element = $('<em></em>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, italic: true })
  })

  it('it should set underline property for node if give u element', () => {
    const element = $('<u></u>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, underline: true })
  })

  it('it should set through property for node if give s element', () => {
    const element = $('<s></s>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, through: true })
  })

  it('it should set through property for node if give strike element', () => {
    const element = $('<strike></strike>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, through: true })
  })

  it('it should set sub property for node if give sub element', () => {
    const element = $('<sub></sub>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, sub: true })
  })

  it('it should set sup property for node if give sup element', () => {
    const element = $('<sup></sup>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, sup: true })
  })

  it('it should set code property for node if give code element', () => {
    const element = $('<code></code>')
    const node = { text: 'text' }
    expect(parseStyleHtml(element[0], node, editor)).toEqual({ ...node, code: true })
  })
})
