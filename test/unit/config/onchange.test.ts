/**
 * @description 事件配置 test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'

test.only('onchange 事件', done => {
    mockCmdFn(document)
    const editor = createEditor(document, 'div1', '', {
        onchange: function (htmlStr: string) {
            // 如果未执行，将会报错：超时 5 秒未执行的异步函数
            done()
        },
    })
    editor.cmd.do('insertHTML', '<span>123</span>') // 修改内容，会触发 onchange
})
