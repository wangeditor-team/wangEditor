/*
    工具
*/

// 和 UA 相关的属性
export const UA = {
    _ua: navigator.userAgent,

    // 是否 webkit
    isWebkit: function () {
        const reg = /webkit/i
        return reg.test(this._ua)
    },

    // 是否 IE
    isIE: function () {
        return 'ActiveXObject' in window
    }
}

// 遍历对象
export function objForEach(obj, fn) {
    let key, result
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result = fn.call(obj, key, obj[key])
            if (result === false) {
                break
            }
        }
    }
}

// 遍历类数组
export function arrForEach(fakeArr, fn) {
    let i, item, result
    const length = fakeArr.length || 0
    for (i = 0; i < length; i++) {
        item = fakeArr[i]
        result = fn.call(fakeArr, item, i)
        if (result === false) {
            break
        }
    }
}

// 获取随机数
export function getRandom(prefix) {
    return prefix + Math.random().toString().slice(2)
}

// 替换 html 特殊字符
export function replaceHtmlSymbol(html) {
    if (html == null) {
        return ''
    }
    return html.replace(/</gm, '&lt')
        .replace(/>/gm, '&gt')
        .replace(/"/gm, '&quot')
        .replace(/(\r\n|\r|\n)/g, '<br/>')
}

// 返回百分比的格式
export function percentFormat(number) {
    number = (parseInt(number * 100))
    return number + '%'
}

// 判断是不是 function
export function isFunction(fn) {
    return typeof fn === 'function'
}

//Base64 编码
export const Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (e) {
        var t = ''
        var n, r, i, s, o, u, a
        var f = 0
        var bt = (typeof e === 'string')
        if (bt) {
            e = Base64._utf8_encode(e)
        }
        while (f < e.length) {
            if (bt) {
                n = e.charCodeAt(f++)
                r = e.charCodeAt(f++)
                i = e.charCodeAt(f++)
            } else {
                n = e[f++]
                r = e[f++]
                i = e[f++]
            }
            s = n >> 2
            o = (n & 3) << 4 | r >> 4
            u = (r & 15) << 2 | i >> 6
            a = i & 63
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = ''
        var n, r, i
        var s, o, u, a
        var f = 0
        e = e.replace(/[^A-Za-z0-9+/=]/g, '')
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++))
            o = this._keyStr.indexOf(e.charAt(f++))
            u = this._keyStr.indexOf(e.charAt(f++))
            a = this._keyStr.indexOf(e.charAt(f++))
            n = s << 2 | o >> 4
            r = (o & 15) << 4 | u >> 2
            i = (u & 3) << 6 | a
            t = t + String.fromCharCode(n)
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t)
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, 'n')
        var t = ''
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192)
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224)
                t += String.fromCharCode(r >> 6 & 63 | 128)
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = ''
        var n = 0
        var r=0 ,c2=0 ,c3=0
        while (n < e.length) {
            r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1)
                t += String.fromCharCode((r & 31) << 6 | c2 & 63)
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1)
                c3 = e.charCodeAt(n + 2)
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
                n += 3
            }
        }
        return t
    },
    str2Bytes: function (str) {
        var pos = 0
        var len = str.length
        if (len % 2 != 0) {
            return null
        }
        len /= 2
        var hexA = new Array()
        for (var i = 0; i < len; i++) {
            var s = str.substr(pos, 2)
            var v = parseInt(s, 16)
            hexA.push(v)
            pos += 2
        }
        return hexA
    }
}
