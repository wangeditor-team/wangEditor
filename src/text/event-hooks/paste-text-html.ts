/**
 * @description 粘贴 text html
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { getPasteText, getPasteHtml } from '../paste/paste-event'
import { escapeHtml, isFunction } from '../../utils/util'
import { urlRegex } from '../../utils/const'
import { DomElement } from '../../utils/dom-core'

/**
  * 格式化html
  * @param val 粘贴的html
  * @author Gavin
  * @description
     格式化html，需要特别注意
     功能：
         1. 将htmlText中的div，都替换成p标签
         2. 将处理后的htmlText模拟先插入到真实dom中，处理P截断问题。
 
     注意点：
         由于P不能嵌套p，会导致标签截断，从而将<p><p>xx</p></p>这样一个结构插入到页面时，会出现很多问题，包括光标位置问题，页面凭空多很多元素的问题。
  */
function formatHtml(htmlText: string) {
    const paste = htmlText
        .replace(/<div>/gim, '<p>') // div 全部替换为 p 标签
        .replace(/<\/div>/gim, '</p>')
        .trim() // 去除''

    // 模拟插入到真实dom中
    const tempContainer = document.createElement('div')

    tempContainer.innerHTML = paste

    return tempContainer.innerHTML.replace(/<p><\/p>/gim, '') // 将被截断的p，都替换掉
}

function myFlat(arr: Array<any>): Array<any> {
    return arr.reduce((pre, item) => pre.concat(Array.isArray(item) ? myFlat(item) : item), [])
}

function loopNode(el: HTMLElement): Array<HTMLElement> {
    if (!el?.children?.length) {
        return [el]
    }
    const list = Array.from(el.children) as Array<HTMLElement>
    return myFlat([el, list.map(loopNode)])
}
/**
 * 通过拆分标签的方式转义html中的特殊字符，避免显示异常
 * @param html 粘贴的html
 * @author Ding
 */

function defEscapeHtml(html: string): string {
    const dom = document.createElement('div')
    dom.innerHTML = html
    /* 插入时，粘贴的非图片、非url内容被转成了P标签 */
    const list = loopNode(dom).filter(item => item.nodeName === 'P')
    list.forEach(v => {
        v.innerHTML = escapeHtml(v.innerText)
    })
    return dom.innerHTML
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
            //当复制的内容为链接时，也应该判断用户是否定义了处理粘贴的事件
            if (pasteTextHandle && isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '') // html
            }

            const insertUrl: string = urlRegex.exec(pasteText)![0]

            const otherText = pasteText.replace(urlRegex, '')
            return editor.cmd.do(
                'insertHTML',
                `<a href="${insertUrl}" target="_blank">${escapeHtml(insertUrl)}</a>${otherText}`
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
            let isCssStyle: boolean = /[\.\#\@]?\w+[ ]+\{[^}]*\}/.test(pasteHtml) // eslint-disable-line
            // 经过处理后还是包含暴露的css样式则直接插入它的text
            if (isCssStyle && pasteFilterStyle) {
                editor.cmd.do('insertHTML', `${formatHtml(pasteText)}`) // text
            } else {
                const html = formatHtml(defEscapeHtml(pasteHtml))
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
                } else {
                    editor.cmd.do('insertHTML', html)

                    // 如果用户从百度等网站点击复制得到的图片是一串img标签且待src的http地址
                    // 见 https://github.com/wangeditor-team/wangEditor/issues/3119
                    // 如果是走用户定义的图片上传逻辑
                    // const isHasOnlyImgEleReg = /^<img [^>]*src=['"]([^'"]+)[^>]*>$/g
                    // if (!isHasOnlyImgEleReg.test(html)) {
                    //     editor.cmd.do('insertHTML', html)
                    // }
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
