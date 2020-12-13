/**
 * @description Editor catalog scroll to head
 * @author luochao
 */

import Editor from '../../../../src/editor'
import scrollToHead from '../../../../src/editor/init-fns/scroll-to-head'
import { TCatalog } from '../../../../src/config/events'
import $ from 'jquery'

const catalogHtml = `<h1>标题一</h1>
<p>
    正文balabala
</p>
<h2>标题二</h2>
<p>
    正文balabala
</p>
<h3>标题三</h3>
<p>
    正文balabala
</p>
<h4>标题四</h4>
<p>
    正文balabala
</p>
<h2>标题五</h2>
<p>
    正文balabala
</p>
<h3>标题六</h3>
<p>
    正文balabala
</p>
<h3>标题七</h3>
<p>
    正文balabala
</p>`

let editor: Editor
let testId = ''
describe('Editor catalog', () => {
    beforeEach(() => {
        const toolbar = document.createElement('div')
        toolbar.id = 'toolbar'
        toolbar.innerHTML = catalogHtml

        document.body.appendChild(toolbar)

        const catalogContainer = document.createElement('div')
        catalogContainer.id = 'catalogContainer'
        document.body.appendChild(catalogContainer)

        editor = new Editor('#toolbar')

        editor.config.onCatalogChange = function (arr: TCatalog[]) {
            const lastItem = arr[arr.length - 1]
            const box = document.getElementById('catalogContainer')

            if (box == null) return

            const a = document.createElement('a')
            a.href = 'javascript:void(0)'
            a.innerText = lastItem.text
            testId = lastItem.id
            a.id = lastItem.id
            box.appendChild(a)
        }

        editor.create()
    })

    test('能滚动到指定的锚点', done => {
        expect.assertions(1)

        const a = $(`${testId}`)

        expect(a).not.toBeNull()

        try {
            scrollToHead(editor, testId)
        } catch (err) {
            done()
        }
    })
})
