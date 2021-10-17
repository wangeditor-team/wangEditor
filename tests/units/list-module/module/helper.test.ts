import { genTag, checkList } from '../../../../packages/list-module/src/module/helper'

describe('List-module module', () => {
  describe('module helper util genTag', () => {
    const fixtures = [
      {
        input: 'numbered-list',
        output: 'ol',
      },
      {
        input: 'bulleted-list',
        output: 'ul',
      },
      {
        input: 'list-item',
        output: 'li',
      },
    ]

    fixtures.forEach(i => {
      test(`genTag should return ${i.output} if pass "${i.input}" value`, () => {
        expect(genTag(i.input)).toBe(i.output)
      })
    })

    test('gen tag should throw Error if pass unrecognized value', () => {
      try {
        genTag('code')
      } catch (err) {
        expect(err.message).toBe(`list type 'code' is invalid`)
      }
    })

    test('gen tag should throw Error if pass unrecognized value', () => {
      try {
        genTag('code')
      } catch (err) {
        expect(err.message).toBe(`list type 'code' is invalid`)
      }
    })
  })

  describe('module helper util checkList', () => {
    const inputs = ['bulleted-list', 'numbered-list']
    inputs.forEach(listType => {
      const node = {
        type: listType,
        children: [],
      }
      test(`checkList should return true if pass valid list type value`, () => {
        expect(checkList(node)).toBeTruthy()
      })
    })

    test(`checkList should return false if pass invalid list type value`, () => {
      const node = {
        type: 'list-item',
        children: [],
      }
      expect(checkList(node)).toBeFalsy()
    })
  })
})
