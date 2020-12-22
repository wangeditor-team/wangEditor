/**
 * @description editor.text getHtmlByNodeList test
 * @author luochao
 */
import getHtmlByNodeList from '../../../src/text/getHtmlByNodeList'
import getChildrenJSON, { NodeListType } from '../../../src/text/getChildrenJSON'
import $ from '../../../src/utils/dom-core'
describe('txt utils geChildrenJSON', () => {
    test('能将元素的所有子元素包括属性还原成json数据', () => {
        const nodeList: NodeListType = [
            '123',
            '',
            {
                tag: 'div',
                attrs: [],
                children: [
                    {
                        tag: 'span',
                        attrs: [
                            {
                                name: 'id',
                                value: 'child',
                            },
                        ],
                        children: [],
                    },
                ],
            },
            {
                tag: 'p',
                attrs: [
                    {
                        name: 'id',
                        value: 'node2',
                    },
                ],
                children: [],
            },
        ]
        const parent = document.createElement('div')
        const html = getHtmlByNodeList(nodeList, parent)
        const json = getChildrenJSON(html)
        expect(json).toEqual(nodeList.filter(Boolean))
    })

    test('如果元素不存在或者没有子元素，则返回空数组', () => {
        const json1 = getChildrenJSON($('.div1'))
        const json2 = getChildrenJSON($('<div></div>'))
        expect(json1.length).toEqual(0)
        expect(json2.length).toEqual(0)
    })
})
