/**
 * @author 翠林
 * @deprecated 数据劫持
 */

import { Data } from '../types'

/**
 * 值发生变化的回调
 */
export type changed = <T>(value: T) => void

/**
 * 过滤函数的返回值
 */
export interface validata<T> {
    valid: Boolean // 验证的结果。true: 验证通过；false: 验证失败。
    data: T // 处理后的值，不需要处理直接返回即可
}

/**
 * 设置值的验证过滤函数
 */
// 暂时放置
export type validator = <T>(data: T) => validata<T>

/**
 *  数据监听实现
 * @param {Object} target 被劫持的对象
 * @param {String} prop 被劫持对象的属性名
 * @param {Function} change 被劫持属性值发生变化时的回调
 * @param {Function}  validate 设置 prop 值前的数据验证和处理
 */
export default function define<T, K>(
    target: Data,
    prop: string,
    change: (value: T | K) => void,
    validate?: (value: T) => validata<T | K>
) {
    // 缓存值
    let temp = target[prop]

    let set = function (value: T) {
        if (value !== temp) {
            temp = value
            change(temp)
        }
        return temp
    }

    if (typeof validate === 'function') {
        set = function (value: T) {
            const { valid, data } = validate(value)
            if (valid && data !== temp) {
                temp = data
                change(temp)
            }
            return temp
        }
    }

    Object.defineProperty(target, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            return temp
        },
        set: set,
    })
}
