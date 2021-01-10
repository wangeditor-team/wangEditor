import $, { DomElementSelector, DomElement } from '../../utils/dom-core'

/**
 * 校验 Editor 的constructor 参数
 * @param toolbarSelector 工具栏 DOM selector
 * @param textSelector 文本区域 DOM selector
 * @author lichen
 */
export default function validateSelectorParams(
    toolbarSelector: DomElementSelector,
    textSelector?: DomElementSelector
): void {
    // 判断 工具栏 DOM selector 是否存在
    if (toolbarSelector == null) {
        throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档')
    }

    const $toolbarSelector = $(toolbarSelector)

    // 收集最外层的container 元素
    const $containerElem: DomElement[] = [$toolbarSelector]
    if (textSelector != null) {
        $containerElem.push($(textSelector))
    }

    // 判断当前传入的dom selector 与 已存在的编辑器区域是否存在嵌套关系 最多 O(2) 次 循环
    const $readyElemArray = $('[data-w-e-ready=true]').elems
    for (const $readyElem of $readyElemArray) {
        for (const $paramElem of $containerElem) {
            const [$param] = $paramElem.elems
            if ($param == null) continue
            if ($readyElem.contains($param) || $param.contains($readyElem))
                throw new Error('错误: 不支持嵌套生成 编辑器')
        }
    }
}
