/**
 * @description link plugin test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import withLink from '../../src/modules/link/plugin'
import createEditor from '../../../../tests/utils/create-editor'

// 模拟 DataTransfer
class MyDataTransfer {
  private values: object = {}
  setData(type: string, value: string) {
    this.values[type] = value
  }
  getData(type: string): string {
    return this.values[type]
  }
}

describe('link plugin', () => {
  const editor = withLink(createEditor())
  const startLocation = Editor.start(editor, [])

  it('link is inline elem', () => {
    const elem = { type: 'link', children: [] }
    expect(editor.isInline(elem)).toBeTruthy()
  })

  it('link insert data', done => {
    const url = 'https://www.wangeditor.com/'

    const data = new MyDataTransfer()
    data.setData('text/plain', url)

    editor.select(startLocation)
    // @ts-ignore
    editor.insertData(data)

    setTimeout(() => {
      const links = editor.getElemsByTypePrefix('link')
      expect(links.length).toBe(1)
      const linkElem = links[0] as any
      expect(linkElem.url).toBe(url)
      done()
    })
  })
})
