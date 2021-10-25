/**
 * @description code content
 * @author wangfupeng
 */

export const text = 'const a = 100;'

export const textNode = { text: text }

export const language = 'javascript'

export const codeNode = {
  type: 'code',
  language,
  children: [textNode],
}

export const preNode = {
  type: 'pre',
  children: [codeNode],
}

export const content = [{ type: 'paragraph', children: [{ text: 'hello world' }] }, preNode]

export const textNodePath = [1, 0, 0]

export const codeLocation = {
  anchor: { offset: text.length, path: textNodePath },
  focus: { offset: text.length, path: textNodePath },
}

export const paragraphLocation = {
  anchor: { offset: 0, path: [0, 0] },
  focus: { offset: 0, path: [0, 0] },
}

describe('加一个 case 防止报错～', () => {
  it('1 + 1 = 2', () => {
    expect(1 + 1).toBe(2)
  })
})
