/**
 * @description 模拟 document.execCommand 等，jest 默认没有
 * @author wangfupeng
 */

export default function (document: Document) {
    document.execCommand = jest.fn()
    document.queryCommandValue = jest.fn()
    document.queryCommandState = jest.fn()
    document.queryCommandSupported = jest.fn()
}
