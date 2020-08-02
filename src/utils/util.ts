/**
 * @description 工具函数集合
 * @author wangfupeng
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
    },
}

/**
 * 获取随机石
 * @param prefix 前缀
 */
export function getRandom(prefix: string = ''): string {
    return prefix + Math.random().toString().slice(2)
}

/**
 * 替换 html 特殊字符
 * @param html html 字符串
 */
export function replaceHtmlSymbol(html: string): string {
    return html
        .replace(/</gm, '&lt;')
        .replace(/>/gm, '&gt;')
        .replace(/"/gm, '&quot;')
        .replace(/(\r\n|\r|\n)/g, '<br/>')
}

/**
 * 遍历对象或数组，执行回调函数
 * @param obj 对象或数组
 * @param fn 回调函数 (key, val) => {...}
 */
export function forEach(obj: Object | [], fn: Function): void {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = fn(key, (obj as any)[key])
            if (result === false) {
                // 提前终止循环
                break
            }
        }
    }
}

/**
 * 遍历类数组
 * @param fakeArr 类数组
 * @param fn 回调函数
 */
export function arrForEach(fakeArr: any, fn: Function): void {
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

/**
 * 节流
 * @param fn 函数
 * @param interval 间隔时间，毫秒
 */
export function throttle(fn: Function, interval: number = 200): Function {
    let flag = false
    return function (...args: any): void {
        if (!flag) {
            flag = true
            setTimeout(() => {
                flag = false
                fn.call(null, ...args) // this 报语法错误，先用 null
            }, interval)
        }
    }
}

/**
 * 防抖
 * @param fn 函数
 * @param delay 间隔时间，毫秒
 */
export function debounce(fn: Function, delay: number = 200): Function {
    let lastFn = 0
    return function (...args: any) {
        if (lastFn) {
            window.clearTimeout(lastFn)
        }
        lastFn = window.setTimeout(() => {
            lastFn = 0
            fn.call(null, ...args) // this 报语法错误，先用 null
        }, delay)
    }
}

/**
 * isFunction 是否是函数
 * @param fn 函数
 */
export function isFunction(fn: any) {
    return typeof fn === 'function'
}
