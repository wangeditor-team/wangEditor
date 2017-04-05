/*
    DOM 操作 API
*/

// 根据 html 代码片段创建 dom 对象
function createElemByHTML(html) {
    let div
    div = document.createElement('div')
    div.innerHTML = html
    return div.children
}

// 是否是 DOM List
function isDOMList(selector) {
    if (!selector) {
        return false
    }
    if (selector instanceof HTMLCollection || selector instanceof NodeList) {
        return true
    }
    return false
}

// 封装 document.querySelectorAll
function querySelectorAll(selector) {
    const result = document.querySelectorAll(selector)
    if (isDOMList(result)) {
        return result
    } else {
        return [result]
    }
}

// 创建构造函数
function DomElement(selector) {
    if (!selector) {
        return
    }

    // selector 本来就是 DomElement 对象，直接返回
    if (selector instanceof DomElement) {
        return selector
    }

    this.selector = selector

    // 根据 selector 得出的结果（如 DOM，DOM List）
    let selectorResult = []
    if (selector.nodeType === 1) {
        // 单个 DOM 节点
        selectorResult = [selector]
    } else if (isDOMList(selector)) {
        // DOM List
        selectorResult = selector
    } else if (typeof selector === 'string') {
        // 字符串
        selector = selector.replace('/\n/mg', '').trim()
        if (selector.indexOf('<') === 0) {
            // 如 <div>
            selectorResult = createElemByHTML(selector)
        } else {
            // 如 #id .class
            selectorResult = querySelectorAll(selector)
        }
    }

    const length = selectorResult.length
    if (!length) {
        // 空数组
        return this
    }

    // 加入 DOM 节点
    let i
    for (i = 0; i < length; i++) {
        this[i] = selectorResult[i]
    }
    this.length = length
}

// 修改原型
DomElement.prototype = {
    constructor: DomElement,

    // 类数组，forEach
    forEach: function (fn) {
        let i
        for (i = 0; i < this.length; i++) {
            const elem = this[i]
            fn.call(elem, elem)
        }
        return this
    },

    // 获取第几个元素
    get: function (index) {
        const length = this.length
        if (index >= length) {
            index = index % length
        }
        return $(this[index])
    },

    // 第一个
    first: function () {
        return this.get(0)
    },

    // 最后一个
    last: function () {
        const length = this.length
        return this.get(length - 1)
    },

    // 绑定事件
    on: function (type, fn) {
        return this.forEach(elem => {
            elem.addEventListener(type, fn.bind(elem))
        })
    },

    // 修改属性
    attr: function (key, val) {
        return this.forEach(elem => {
            elem.setAttribute(key, val)
        })
    },

    // 添加 class
    addClass: function(className) {
        if (!className) {
            return this
        }
        return this.forEach(elem => {
            if (elem.className) {
                elem.className = elem.className + ' ' + className
            } else {
                elem.className = className
            }
        })
    },

    // 修改 css
    css: function (key, val) {
        return this.forEach(elem => {
            const style = (elem.getAttribute('style') || '').trim()
            let result = ''
            if (style) {
                // style 有值
                if (style.slice(-1) === ';') {
                    // 最后有 ;
                    result = `${style}${key}: ${val};`
                } else {
                    // 最后无 ;
                    result = `${style};${key}: ${val};`
                }
            } else {
                // style 无值
                result = `${key}: ${val};`
            }
            elem.setAttribute('style', result)
        })
    },

    // 获取子节点
    children: function () {
        const elem = this[0]
        if (!elem) {
            return null
        }

        return $(elem.children)
    },

    // 增加子节点
    append: function($children) {
        return this.forEach(elem => {
            $children.forEach(child => {
                elem.appendChild(child)
            })
        })
    },

    // 移除当前节点
    remove: function () {
        return this.forEach(elem => {
            if (elem.remove) {
                elem.remove()
            } else {
                const parent = elem.parentElement
                parent.removeChild(elem)
            }
        })
    },

    // 是否包含某个子节点
    isContain: function ($child) {
        const elem = this[0]
        const child = $child[0]
        return elem.contains(child)
    }
}

// new 一个对象
function $(selector) {
    return new DomElement(selector)
}

export default $
