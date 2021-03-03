/**
 * @description 粘贴 text html
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { getPasteText, getPasteHtml } from '../paste/paste-event'
import { isFunction } from '../../utils/util'
import { urlRegex } from '../../utils/const'
import { DomElement } from '../../utils/dom-core'

/**
 * 格式化html
 * @param val 粘贴的html
 * @author liuwei
 */
function formatHtml(val: string) {
    let pasteText = val
    // div 全部替换为 p 标签
    pasteText = pasteText.replace(/<div>/gim, '<p>').replace(/<\/div>/gim, '</p>')
    // 不允许空行，放在最后
    pasteText = pasteText.replace(/<p><\/p>/gim, '<p><br></p>')
    // 去除''
    return pasteText.trim()
}

/**
 * 格式化html
 * @param val 粘贴的html
 * @author liuwei
 */
function formatCode(val: string) {
    let pasteText = val.replace(/<br>|<br\/>/gm, '\n').replace(/<[^>]+>/gm, '')

    return pasteText
}

/**
 * 判断html是否使用P标签包裹
 * @param html 粘贴的html
 * @author luochao
 */
function isParagraphHtml(html: string): boolean {
    if (html === '') return false

    const container = document.createElement('div')
    container.innerHTML = html

    return container.firstChild?.nodeName === 'P'
}

/**
 * 判断当前选区是否是空段落
 * @param topElem 选区顶层元素
 * @author luochao
 */
function isEmptyParagraph(topElem: DomElement | undefined): boolean {
    if (!topElem?.length) return false

    const dom = topElem.elems[0]

    return dom.nodeName === 'P' && dom.innerHTML === '<br>'
}

/**
 * 粘贴文本和 html
 * @param editor 编辑器对象
 * @param pasteEvents 粘贴事件列表
 */
function pasteTextHtml(editor: Editor, pasteEvents: Function[]) {
    function fn(e: Event) {
        // 获取配置
        const config = editor.config
        const pasteFilterStyle = config.pasteFilterStyle
        const pasteIgnoreImg = config.pasteIgnoreImg
        const pasteTextHandle = config.pasteTextHandle

        // 获取粘贴的文字
        let pasteHtml = getPasteHtml(e as ClipboardEvent, pasteFilterStyle, pasteIgnoreImg)
        let pasteText = getPasteText(e as ClipboardEvent)
        pasteText = pasteText.replace(/\n/gm, '<br>')
        // 当前选区所在的 DOM 节点
        const $selectionElem = editor.selection.getSelectionContainerElem()
        if (!$selectionElem) {
            return
        }
        const nodeName = $selectionElem?.getNodeName()
        const $topElem = $selectionElem?.getNodeTop(editor)
        // 当前节点顶级可能没有
        let topNodeName: string = ''
        if ($topElem.elems[0]) {
            topNodeName = $topElem?.getNodeName()
        }
        // code 中只能粘贴纯文本
        if (nodeName === 'CODE' || topNodeName === 'PRE') {
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '')
            }
            editor.cmd.do('insertHTML', formatCode(pasteText))
            return
        }

        // 如果用户开启闭粘贴样式注释则将复制进来为url的直接转为链接 否则不转换
        //  在群中有用户提到关闭样式粘贴复制的文字进来后链接直接转为文字了，不符合预期，这里优化下
        if (urlRegex.test(pasteText) && pasteFilterStyle) {
            return editor.cmd.do(
                'insertHTML',
                `<a href="${pasteText}" target="_blank">${pasteText}</a>`
            ) // html
        }
        // table 中（td、th），待开发。。。
        if (!pasteHtml) {
            return
        }
        try {
            // firefox 中，获取的 pasteHtml 可能是没有 <ul> 包裹的 <li>
            // 因此执行 insertHTML 会报错
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteHtml = '' + (pasteTextHandle(pasteHtml) || '') // html
            }
            // 粘贴的html的是否是css的style样式
            let isCssStyle: boolean = /[\.\#\@]?\w+[^{]+\{[^}]*\}/.test(pasteHtml) // eslint-disable-line
            // 经过处理后还是包含暴露的css样式则直接插入它的text
            if (isCssStyle && pasteFilterStyle) {
                editor.cmd.do('insertHTML', `${formatHtml(pasteText)}`) // text
            } else {
                const html = formatHtml(pasteHtml)
                // 如果是段落，为了兼容 firefox 和 chrome差异，自定义插入
                if (isParagraphHtml(html)) {
                    const $textEl = editor.$textElem
                    editor.cmd.do('insertHTML', html)
                    // 全选的情况下覆盖原有内容
                    if ($textEl.equal($selectionElem)) {
                        // 更新选区
                        editor.selection.createEmptyRange()
                        return
                    }
                    // 如果选区是空段落，移除空段落
                    if (isEmptyParagraph($topElem)) {
                        $topElem.remove()
                    }

                    // 当复制粘贴的内容是 段落 的时候
                    // 这里会将光标移动到编辑区域的末端
                    // 如果是作为重置光标来使用的，应该是将光标移动到插入的 html 的末端才对
                    // 注释后并没有发现光标的位置不正常

                    // 移动光标到编辑器最后的位置
                    // const lastEl = $textEl.last()
                    // if (!lastEl?.length) return
                    // editor.selection.moveCursor(lastEl.elems[0])
                } else {
                    editor.cmd.do('insertHTML', html) // html
                }
            }
        } catch (ex) {
            // 此时使用 pasteText 来兼容一下
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '')
            }
            editor.cmd.do('insertHTML', `${formatHtml(pasteText)}`) // text
        }
    }

    pasteEvents.push(fn)
}

export default pasteTextHtml
