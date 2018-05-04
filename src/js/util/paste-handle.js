/*
    粘贴信息的处理
*/

import $ from './dom-core.js'
import { replaceHtmlSymbol,objForEach,Base64} from './util.js'

// 获取粘贴的纯文本
export function getPasteText(e) {
    const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
    let pasteText
    if (clipboardData == null) {
        pasteText = window.clipboardData && window.clipboardData.getData('text')
    } else {
        pasteText = clipboardData.getData('text/plain')
    }

    return replaceHtmlSymbol(pasteText)
}

// 获取粘贴的html
export function getPasteHtml(e, filterStyle, ignoreImg) {
    const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
    let pasteText, pasteHtml
    if (clipboardData == null) {
        pasteText = window.clipboardData && window.clipboardData.getData('text')
    } else {
        pasteText = clipboardData.getData('text/plain')
        pasteHtml = clipboardData.getData('text/html')
    }
    if (!pasteHtml && pasteText) {
        pasteHtml = '<p>' + replaceHtmlSymbol(pasteText) + '</p>'
    }
    if (!pasteHtml) {
        return
    }

    // 过滤word中状态过来的无用字符
    const docSplitHtml = pasteHtml.split('</html>')
    if (docSplitHtml.length === 2) {
        pasteHtml = docSplitHtml[0]
    }

    // 过滤无用标签
    pasteHtml = pasteHtml.replace(/<(meta|script|link).+?>/igm, '')
    // 去掉注释
    pasteHtml = pasteHtml.replace(/<!--.*?-->/mg, '')
    // 过滤 data-xxx 属性
    pasteHtml = pasteHtml.replace(/\s?data-.+?=('|").+?('|")/igm, '')

    if (ignoreImg) {
        // 忽略图片
        pasteHtml = pasteHtml.replace(/<img.+?>/igm, '')
    }

    if (filterStyle) {
        // 过滤样式
        pasteHtml = pasteHtml.replace(/\s?(class|style)=('|").*?('|")/igm, '')
    } else {
        // 保留样式
        pasteHtml = pasteHtml.replace(/\s?class=('|").*?('|")/igm, '')
    }

    return pasteHtml
}

// 获取粘贴的图片文件
export function getPasteImgs(e) {
    const result = []
    const txt = getPasteText(e)
    if (txt) {
        // 有文字，就忽略图片
        return result
    }

    const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData) || {}
    const items = clipboardData.items
    if (!items) {
        return result
    }

    objForEach(items, (key, value) => {
        const type = value.type
        if (/image/i.test(type)) {
            result.push(value.getAsFile())
        }
    })

    return result
}


/**
 *
 * 获取从word粘贴的图片文件
 * @param e
 * @param callback  回调
 */
export function getPasteRtfImgs(e, callback) {
    var result = []
    var clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData || {}
    var items = clipboardData.items
    var isFind = false
    if (items && items.length > 0) {
        objForEach(items, function (key, value) {
            var type = value.type
            if (callback && type === 'text/rtf') {
                isFind = true
                value.getAsString(function (s) {
                    // console.log('rtf s:',s)
                    var arrayImg = s.match(/bliptag[-]?\d{1,}(\{[^\}]*\})?[^\}\\]*\}/ig)
                    if(arrayImg && arrayImg.length>0) {
                        console.log('rtf arrayImg:', arrayImg.length)
                        for(var i in arrayImg){
                            var imgOne = getRtfImg(arrayImg[i])
                            if (imgOne && imgOne.length > 0) {
                                result.push('data:image/png;base64,' + imgOne)
                            }
                        }
                    }
                    callback(result)
                })
                return
            }
        })
    }
    if (!isFind && callback) {
        callback(result)
    }
}

function getRtfImg(s) {
    if (s.startsWith('bliptag') && s.endsWith('}')) {
        var newStr = s.substring(0, s.length-1)
        newStr = newStr.replace(/bliptag[-]?\d{1,}(\{[^\}]*\})?[\s\S]/g, '') //去掉头部的 bliptag标记
        if (newStr.indexOf('\\') > -1) {
            //MetaFile类型的16进制数据,不进行处理
            //console.log('rtf return null:');
            return null
        }
        newStr = newStr.replace(/\r/g, '\n')
        newStr = newStr.replace(/\n/g, '')
        newStr = newStr.replace(/\s/g, '')
        var arrHex = Base64.str2Bytes(newStr)
        return Base64.encode(arrHex)
    }
    return null
}