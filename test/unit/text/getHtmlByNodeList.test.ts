/**
 * @description editor.text getHtmlByNodeList test
 * @author luochao
 */
import getHtmlByNodeList from '../../../src/text/getHtmlByNodeList'
import { NodeListType } from '../../../src/text/getChildrenJSON'
describe('txt utils getHtmlByNodeList', () => {
    test('能将 nodeList 全部聚合成在一个 container 元素中, 并支持子元素嵌套', () => {
        const nodeList: NodeListType = [
            '123',
            {
                tag: 'div',
                attrs: [
                    {
                        name: 'id',
                        value: 'node1',
                    },
                ],
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
        const html = getHtmlByNodeList(nodeList)
        expect(html.elems[0].innerHTML).toBe(
            '123<div id="node1"><span id="child"></span></div><p id="node2"></p>'
        )
    })
})
