/**
 * @description 模拟 document.execCommand 等，jest 默认没有
 * @author wangfupeng
 */

export default function (document: Document) {
    /**
     * 说明：
     * document.execCommand 赋值为一个空函数，这是因为 jest 本身不支持 document.execCommand ，所以只能这样模拟。
     * 所以，执行这个命令，如 document.execCommand('bold')，是**不会**像浏览器一样实现加粗的。
     *
     * 但是，有一个例外情况需要注意，就是 editor.cmd.do('insertHTML', xx) ！！！
     * 根据 src/editor/command.ts 的代码逻辑，在 jest 中执行 editor.cmd.do('insertHTML', xx) 最终会走到 `range.insertNode($(html).elems[0])` 这一行
     * 所以，可以执行成功
     */
    document.execCommand = jest.fn()

    document.queryCommandValue = jest.fn()
    document.queryCommandState = jest.fn()
    document.queryCommandSupported = jest.fn()
}
