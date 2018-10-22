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

/**
 * 封装 document.querySelectorAll
 * @param selector 选择器
 * @param context 当前查询上下文，为了提高 DOM 查询性能，或者使得可以在 ShadowDOM 中使用
 * @returns {HTMLCollection|NodeList|[]}
 */
function querySelectorAll(selector, context) {
    let queryContext = context

    if (context instanceof DomElement) {
        queryContext = context[0]
    }

    queryContext = queryContext || document

    const result = queryContext.querySelectorAll(selector)

    if (isDOMList(result)) {
        return result
    } else {
        return [result]
    }
}

// 记录所有的事件绑定
const eventList = []

// 创建构造函数
function DomElement(selector, context) {
    if (!selector) {
        return
    }

    // selector 本来就是 DomElement 对象，直接返回
    if (selector instanceof DomElement) {
        return selector
    }

    this.selector = selector
    const nodeType = selector.nodeType

    // 根据 selector 得出的结果（如 DOM，DOM List）
    let selectorResult = []
    if (nodeType === 9) {
        // document 节点
        selectorResult = [selector]
    } else if (nodeType === 1) {
        // 单个 DOM 节点
        selectorResult = [selector]
    } else if (isDOMList(selector) || selector instanceof Array) {
        // DOM List 或者数组
        selectorResult = selector
    } else if (typeof selector === 'string') {
        // 字符串
        selector = selector.replace('/\n/mg', '').trim()
        if (selector.indexOf('<') === 0) {
            // 如 <div>
            selectorResult = createElemByHTML(selector)
        } else {
            // 如 #id .class
            selectorResult = querySelectorAll(selector, context)
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
            const result = fn.call(elem, elem, i)
            if (result === false) {
                break
            }
        }
        return this
    },

    // clone
    clone: function (deep) {
        const cloneList = []
        this.forEach(elem => {
            cloneList.push(elem.cloneNode(!!deep))
        })
        return $(cloneList)
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
    on: function (type, selector, fn) {
        // selector 不为空，证明绑定事件要加代理
        if (!fn) {
            fn = selector
            selector = null
        }

        // type 是否有多个
        let types = []
        types = type.split(/\s+/)

        return this.forEach(elem => {
            types.forEach(type => {
                if (!type) {
                    return
                }

                // 记录下，方便后面解绑
                eventList.push({
                    elem: elem,
                    type: type,
                    fn: fn
                })

                if (!selector) {
                    // 无代理
                    elem.addEventListener(type, fn)
                    return
                }

                // 有代理
                elem.addEventListener(type, e => {
                    const target = e.target
                    if (target.matches(selector)) {
                        fn.call(target, e)
                    }
                })
            })
        })
    },

    // 取消事件绑定
    off: function (type, fn) {
        return this.forEach(elem => {
            elem.removeEventListener(type, fn)
        })
    },

    // 获取/设置 属性
    attr: function (key, val) {
        if (val == null) {
            // 获取值
            return this[0].getAttribute(key)
        } else {
            // 设置值
            return this.forEach(elem => {
                elem.setAttribute(key, val)
            })
        }
    },

    // 添加 class
    addClass: function(className) {
        if (!className) {
            return this
        }
        return this.forEach(elem => {
            let arr
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/)
                arr = arr.filter(item => {
                    return !!item.trim()
                })
                // 添加 class
                if (arr.indexOf(className) < 0) {
                    arr.push(className)
                }
                // 修改 elem.class
                elem.className = arr.join(' ')
            } else {
                elem.className = className
            }
        })
    },

    // 删除 class
    removeClass: function (className) {
        if (!className) {
            return this
        }
        return this.forEach(elem => {
            let arr
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/)
                arr = arr.filter(item => {
                    item = item.trim()
                    // 删除 class
                    if (!item || item === className) {
                        return false
                    }
                    return true
                })
                // 修改 elem.class
                elem.className = arr.join(' ')
            }
        })
    },

    // 修改 css
    css: function (key, val) {
        const currentStyle = `${key}:${val};`
        return this.forEach(elem => {
            const style = (elem.getAttribute('style') || '').trim()
            let styleArr, resultArr = []
            if (style) {
                // 将 style 按照 ; 拆分为数组
                styleArr = style.split(';')
                styleArr.forEach(item => {
                    // 对每项样式，按照 : 拆分为 key 和 value
                    let arr = item.split(':').map(i => {
                        return i.trim()
                    })
                    if (arr.length === 2) {
                        resultArr.push(arr[0] + ':' + arr[1])
                    }
                })
                // 替换或者新增
                resultArr = resultArr.map(item => {
                    if (item.indexOf(key) === 0) {
                        return currentStyle
                    } else {
                        return item
                    }
                })
                if (resultArr.indexOf(currentStyle) < 0) {
                    resultArr.push(currentStyle)
                }
                // 结果
                elem.setAttribute('style', resultArr.join('; '))
            } else {
                // style 无值
                elem.setAttribute('style', currentStyle)
            }
        })
    },

    // 显示
    show: function () {
        return this.css('display', 'block')
    },

    // 隐藏
    hide: function () {
        return this.css('display', 'none')
    },

    // 获取子节点
    children: function () {
        const elem = this[0]
        if (!elem) {
            return null
        }

        return $(elem.children)
    },

    // 获取子节点（包括文本节点）
    childNodes: function () {
        const elem = this[0]
        if (!elem) {
            return null
        }

        return $(elem.childNodes)
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
                parent && parent.removeChild(elem)
            }
        })
    },

    // 是否包含某个子节点
    isContain: function ($child) {
        const elem = this[0]
        const child = $child[0]
        return elem.contains(child)
    },

    // 尺寸数据
    getSizeData: function () {
        const elem = this[0]
        return elem.getBoundingClientRect()  // 可得到 bottom height left right top width 的数据
    },

    // 封装 nodeName
    getNodeName: function () {
        const elem = this[0]
        return elem.nodeName
    },

    // 从当前元素查找
    find: function (selector) {
        const elem = this[0]
        return $(elem.querySelectorAll(selector))
    },

    // 获取当前元素的 text
    text: function (val) {
        if (!val) {
            // 获取 text
            const elem = this[0]
            return elem.innerHTML.replace(/<.*?>/g, () => '')
        } else {
            // 设置 text
            return this.forEach(elem => {
                elem.innerHTML = val
            })
        }
    },

    // 获取 html
    html: function (value) {
        const elem = this[0]
        if (value == null) {
            return elem.innerHTML
        } else {
            elem.innerHTML = value
            return this
        }
    },

    // 获取 value
    val: function () {
        const elem = this[0]
        return elem.value.trim()
    },

    // focus
    focus: function () {
        return this.forEach(elem => {
            elem.focus()
        })
    },

    // parent
    parent: function () {
        const elem = this[0]
        return $(elem.parentElement)
    },

    // parentUntil 找到符合 selector 的父节点
    parentUntil: function (selector, _currentElem) {
        const results = document.querySelectorAll(selector)
        const length = results.length
        if (!length) {
            // 传入的 selector 无效
            return null
        }

        const elem = _currentElem || this[0]
        if (elem.nodeName === 'BODY') {
            return null
        }

        const parent = elem.parentElement
        let i
        for (i = 0; i < length; i++) {
            if (parent === results[i]) {
                // 找到，并返回
                return $(parent)
            }
        }

        // 继续查找
        return this.parentUntil(selector, parent)
    },

    // 判断两个 elem 是否相等
    equal: function ($elem) {
        if ($elem.nodeType === 1) {
            return this[0] === $elem
        } else {
            return this[0] === $elem[0]
        }
    },

    // 将该元素插入到某个元素前面
    insertBefore: function (selector) {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(elem => {
            const parent = referenceNode.parentNode
            parent.insertBefore(elem, referenceNode)
        })
    },

    // 将该元素插入到某个元素后面
    insertAfter: function (selector) {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(elem => {
            const parent = referenceNode.parentNode
            if (parent.lastChild === referenceNode) {
                // 最后一个元素
                parent.appendChild(elem)
            } else {
                // 不是最后一个元素
                parent.insertBefore(elem, referenceNode.nextSibling)
            }
        })
    }
}

// new 一个对象
function $(selector, context) {
    return new DomElement(selector, context)
}

// 解绑所有事件，用于销毁编辑器
$.offAll = function () {
    eventList.forEach(item => {
        const elem = item.elem
        const type = item.type
        const fn = item.fn
        // 解绑
        elem.removeEventListener(type, fn)
    })
}

export default $
