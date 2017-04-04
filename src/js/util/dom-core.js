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
        return
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
            const dom = this[i]
            fn.call(dom, dom)
        }
        return this
    },

    // 绑定事件
    on: function (type, fn) {
        return this.forEach(dom => {
            dom.addEventListener(type, fn.bind(dom))
        })
    },

    // 修改属性
    attr: function (key, val) {
        return this.forEach(dom => {
            dom.setAttribute(key, val)
        })
    },

    // 添加 class
    addClass: function(className) {
        if (!className) {
            return this
        }
        return this.forEach(dom => {
            if (dom.className) {
                dom.className = dom.className + ' ' + className
            } else {
                dom.className = className
            }
        })
    },

    // 修改 css
    css: function (key, val) {
        return this.forEach(dom => {
            let style = dom.getAttribute('style')
            if (style) {
                // style 有值
                style = `${key}: ${val};${style}`
            } else {
                // style 无值
                style = `${key}: ${val};`
            }
            dom.setAttribute('style', style)
        })
    },

    // 增加子节点
    append: function(elem) {
        if (!elem) {
            return this
        }
        return this.forEach(dom => {
            if (elem.nodeType === 1) {
                // elem 是 DOM 节点
                dom.appendChild(elem)
            } else if (elem instanceof DomElement) {
                // elem 是 DomElement 对象
                elem.forEach((elemDom) => {
                    dom.appendChild(elemDom)
                })
            }
        })
    },

    // 移除当前节点
    remove: function () {
        return this.forEach(dom => {
            if (dom.remove) {
                dom.remove()
            } else {
                const parent = dom.parentElement
                parent.removeChild(dom)
            }
        })
    }
}


export default (selector) => {
    return new DomElement(selector)
}
