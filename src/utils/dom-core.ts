/**
 * @description 封装 DOM 操作
 * @wangfupeng
 */

// 记录所有的事件绑定
type EventItem = {
    elem: HTMLElement
    type: string
    fn: Function
}
const EVENT_LIST: EventItem[] = []

/**
 * DOM List 转为 HTMLElement 数组
 * @param elems DOM List
 */
function _toArray<T>(elems: T): HTMLElement[] {
    return Array.prototype.slice.call(elems)
}

/**
 * 根据 html 字符串创建 elem
 * @param {String} html html
 */
function _createElemByHTML(html: string): HTMLElement[] {
    const div = document.createElement('div')
    div.innerHTML = html
    const elems = div.children
    return _toArray(elems)
}

/**
 * 判断是否是 DOM List
 * @param selector DOM 元素或列表
 */
function _isDOMList(selector: any): boolean {
    if (!selector) {
        return false
    }
    if (selector instanceof HTMLCollection || selector instanceof NodeList) {
        return true
    }
    return false
}

/**
 * 封装 querySelectorAll
 * @param selector css 选择器
 */
function _querySelectorAll(selector: string): HTMLElement[] {
    const elems = document.querySelectorAll(selector)
    return _toArray(elems)
}

// 构造函数
export class DomElement {
    // 定义属性
    selector: string
    length: number
    elems: HTMLElement[]
    dataSource: Map<string, any>

    /**
     * 构造函数
     * @param selector 任一类型的选择器
     */
    constructor(selector: string)
    constructor(selector: DomElement)
    constructor(selector: HTMLElement)
    constructor(selector: Document)
    constructor(selector: HTMLCollection)
    constructor(selector: NodeList)
    constructor(selector: HTMLElement[])
    constructor(selector: any) {
        // 初始化属性
        this.selector = ''
        this.elems = []
        this.length = this.elems.length
        this.dataSource = new Map()

        if (!selector) {
            return
        }

        // 原本就是 DomElement 实例，则直接返回
        if (selector instanceof DomElement) {
            return selector
        }

        let selectorResult: HTMLElement[] = [] // 存储查询结果
        this.selector = selector
        const nodeType = selector.nodeType

        if (nodeType === 9) {
            // document 节点
            selectorResult = [selector]
        } else if (nodeType === 1) {
            // 单个 DOM 节点
            selectorResult = [selector]
        } else if (_isDOMList(selector)) {
            // DOM List
            selectorResult = _toArray(selector)
        } else if (selector instanceof Array) {
            // Element 数组（其他数据类型，暂时忽略）
            selectorResult = selector
        } else if (typeof selector === 'string') {
            // 字符串
            selector = selector.replace('/\n/mg', '').trim()
            if (selector.indexOf('<') === 0) {
                // 如 <div>
                selectorResult = _createElemByHTML(selector)
            } else {
                // 如 #id .class
                selectorResult = _querySelectorAll(selector)
            }
        }

        const length = selectorResult.length
        if (!length) {
            // 空数组
            return this
        }

        // 加入 DOM 节点
        let i = 0
        for (; i < length; i++) {
            this.elems.push(selectorResult[i])
        }
        this.length = length
    }

    /**
     * 遍历所有元素，执行回调函数
     * @param fn 回调函数
     */
    forEach(fn: Function): DomElement {
        for (let i = 0; i < this.length; i++) {
            const elem = this.elems[i]
            const result = fn.call(elem, elem, i)
            if (result === false) {
                break
            }
        }
        return this
    }

    /**
     * 克隆元素
     * @param deep 是否深度克隆
     */
    clone(deep: boolean = false): DomElement {
        const cloneList: HTMLElement[] = []
        this.elems.forEach(elem => {
            cloneList.push(elem.cloneNode(!!deep) as HTMLElement)
        })
        return $(cloneList)
    }

    /**
     * 获取第几个元素
     * @param index index
     */
    get(index: number = 0): DomElement {
        const length = this.length
        if (index >= length) {
            index = index % length
        }
        return $(this.elems[index])
    }

    /**
     * 获取第一个元素
     */
    first(): DomElement {
        return this.get(0)
    }

    /**
     * 获取最后一个元素
     */
    last(): DomElement {
        const length = this.length
        return this.get(length - 1)
    }

    /**
     * 绑定事件
     * @param type 事件类型
     * @param selector DOM 选择器
     * @param fn 事件函数
     */
    on(type: string, fn: Function): DomElement
    on(type: string, selector: string, fn: Function): DomElement
    on(type: string, selector: string | Function, fn?: Function): DomElement {
        // 没有 selector ，只有 type 和 fn
        if (typeof selector === 'function') {
            fn = selector
            selector = ''
        }

        const curFn = fn as Function

        // type 是否有多个
        const types = type.split(/\s+/)

        return this.forEach(function (elem: HTMLElement) {
            types.forEach(type => {
                if (!type) {
                    return
                }

                // 记录下，方便后面解绑
                EVENT_LIST.push({
                    elem: elem,
                    type: type,
                    fn: curFn,
                })

                // 没有事件代理
                if (!selector) {
                    // 无代理
                    elem.addEventListener(type, e => {
                        curFn(e)
                    })
                    return
                }

                // 有事件代理
                elem.addEventListener(type, e => {
                    const target = e.target as HTMLElement
                    if (target.matches(selector as string)) {
                        curFn.call(target, e)
                    }
                })
            })
        })
    }

    /**
     * 解绑事件
     * @param type 事件类型
     * @param fn 事件函数
     */
    off(type: string, fn: Function): DomElement {
        return this.forEach(function (elem: HTMLElement) {
            elem.removeEventListener(type, e => fn(e))
        })
    }

    /**
     * 设置/获取 属性
     * @param key key
     * @param val value
     */
    attr(key: string, val: string): DomElement
    attr(key: string): string
    attr(key: string, val?: string): DomElement | string {
        if (val == null) {
            // 获取数据
            return this.elems[0].getAttribute(key) || ''
        }

        // 否则，设置属性
        return this.forEach(function (elem: HTMLElement) {
            elem.setAttribute(key, val)
        })
    }

    /**
     * 添加 css class
     * @param className css class
     */
    addClass(className: string): DomElement {
        if (!className) {
            return this
        }

        return this.forEach(function (elem: HTMLElement) {
            if (elem.className) {
                // 当前有 class
                let arr: string[] = elem.className.split(/\s/)
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
                // 当前没有 class
                elem.className = className
            }
        })
    }

    /**
     * 添加 css class
     * @param className css class
     */
    removeClass(className: string): DomElement {
        if (!className) {
            return this
        }
        return this.forEach(function (elem: HTMLElement) {
            if (!elem.className) {
                // 当前无 class
                return
            }

            let arr: string[] = elem.className.split(/\s/)
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
        })
    }

    /**
     * 修改 css
     * @param key css key
     * @param val css value
     */
    css(key: string, val: string | number): DomElement {
        const currentStyle = `${key}:${val};`
        return this.forEach(function (elem: HTMLElement) {
            const style = (elem.getAttribute('style') || '').trim()
            if (style) {
                // 有 style，将 style 按照 `;` 拆分为数组
                const styleArr: string[] = style.split(';')
                let resultArr: string[] = []
                styleArr.forEach(item => {
                    // 对每项样式，按照 : 拆分为 key 和 value
                    let arr = item.split(':').map(i => {
                        return i.trim()
                    })
                    if (arr.length === 2) {
                        resultArr.push(arr[0] + ':' + arr[1])
                    }
                })
                // 替换现有的 style
                resultArr = resultArr.map(item => {
                    if (item.indexOf(key) === 0) {
                        return currentStyle
                    } else {
                        return item
                    }
                })
                // 新增 style
                if (resultArr.indexOf(currentStyle) < 0) {
                    resultArr.push(currentStyle)
                }
                // 重新设置 style
                elem.setAttribute('style', resultArr.join('; '))
            } else {
                // 当前没有 style
                elem.setAttribute('style', currentStyle)
            }
        })
    }

    /**
     * 封装 getBoundingClientRect
     */
    getBoundingClientRect(): DOMRect {
        const elem = this.elems[0]
        return elem.getBoundingClientRect()
    }

    /**
     * 显示
     */
    show(): DomElement {
        return this.css('display', 'block')
    }

    /**
     * 隐藏
     */
    hide(): DomElement {
        return this.css('display', 'none')
    }

    /**
     * 获取子节点（只有 DOM 元素）
     */
    children(): DomElement | null {
        const elem = this.elems[0]
        if (!elem) {
            return null
        }

        return $(elem.children)
    }

    /**
     * 获取子节点（包括文本节点）
     */
    childNodes(): DomElement | null {
        const elem = this.elems[0]
        if (!elem) {
            return null
        }

        return $(elem.childNodes)
    }

    /**
     * 增加子节点
     * @param $children 子节点
     */
    append($children: DomElement): DomElement {
        return this.forEach(function (elem: HTMLElement) {
            $children.forEach(function (child: HTMLElement) {
                elem.appendChild(child)
            })
        })
    }

    /**
     * 移除当前节点
     */
    remove(): DomElement {
        return this.forEach(function (elem: HTMLElement) {
            if (elem.remove) {
                elem.remove()
            } else {
                const parent = elem.parentElement
                parent && parent.removeChild(elem)
            }
        })
    }

    /**
     * 当前元素，是否包含某个子元素
     * @param $child 子元素
     */
    isContain($child: DomElement): boolean {
        const elem = this.elems[0]
        const child = $child.elems[0]
        return elem.contains(child)
    }

    /**
     * 获取当前元素的尺寸和位置信息
     */
    getSizeData(): DOMRect {
        const elem = this.elems[0]
        // 可得到 bottom height left right top width 的数据
        return elem.getBoundingClientRect()
    }

    /**
     * 获取当前元素 nodeName
     */
    getNodeName(): string {
        const elem = this.elems[0]
        return elem.nodeName
    }

    /**
     * 查询
     * @param selector css 选择器
     */
    find(selector: string): DomElement {
        const elem = this.elems[0]
        return $(elem.querySelectorAll(selector))
    }

    /**
     * 获取/设置 元素 text
     * @param val text 值
     */
    text(): string
    text(val: string): DomElement
    text(val?: string): DomElement | string {
        if (!val) {
            // 获取 text
            const elem = this.elems[0]
            return elem.innerHTML.replace(/<.*?>/g, () => '')
        } else {
            // 设置 text
            return this.forEach(function (elem: HTMLElement) {
                elem.innerHTML = val
            })
        }
    }

    /**
     * 设置/获取 元素 html
     * @param val html 值
     */
    html(): string
    html(val: string): DomElement
    html(val?: string): DomElement | string {
        const elem = this.elems[0]
        if (!val) {
            // 获取 html
            return elem.innerHTML
        } else {
            // 设置 html
            elem.innerHTML = val
            return this
        }
    }

    /**
     * 获取元素 value
     */
    val(): string {
        const elem = this.elems[0]
        return (elem as any).value.trim() // 暂用 any
    }

    /**
     * focus 到当前元素
     */
    focus(): DomElement {
        return this.forEach(function (elem: HTMLElement) {
            elem.focus()
        })
    }

    /**
     * 获取父元素
     */
    parent(): DomElement {
        const elem = this.elems[0]
        return $(elem.parentElement)
    }

    /**
     * 查找父元素，知道满足 selector 条件
     * @param selector css 选择器
     * @param curElem 从哪个元素开始查找，默认为当前元素
     */
    parentUntil(selector: string): DomElement | null
    parentUntil(selector: string, curElem: HTMLElement): DomElement | null
    parentUntil(selector: string, curElem?: HTMLElement): DomElement | null {
        const elem = curElem || this.elems[0]
        if (elem.nodeName === 'BODY') {
            return null
        }

        const parent = elem.parentElement
        if (parent == null) {
            return null
        }

        if (parent.matches(selector)) {
            // 找到，并返回
            return $(parent)
        }

        // 继续查找，递归
        return this.parentUntil(selector, parent as HTMLElement)
    }

    /**
     * 判读是否相等
     * @param $elem 元素
     */
    equal($elem: DomElement | HTMLElement): boolean {
        if ($elem instanceof DomElement) {
            return this.elems[0] === $elem.elems[0]
        } else if ($elem instanceof HTMLElement) {
            return this.elems[0] === $elem
        } else {
            return false
        }
    }

    /**
     * 将该元素插入到某个元素前面
     * @param selector css 选择器
     */
    insertBefore(selector: string | DomElement): DomElement {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode.elems[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(function (elem: HTMLElement) {
            const parent = referenceNode.parentNode as Node
            parent.insertBefore(elem, referenceNode)
        })
    }

    /**
     * 将该元素插入到某个元素后面
     * @param selector css 选择器
     */
    insertAfter(selector: string): DomElement {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode.elems[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(function (elem: HTMLElement) {
            const parent = referenceNode.parentNode as Node
            if (parent.lastChild === referenceNode) {
                // 最后一个元素
                parent.appendChild(elem)
            } else {
                // 不是最后一个元素
                parent.insertBefore(elem, referenceNode.nextSibling)
            }
        })
    }

    /**
     * 设置/获取 数据
     * @param key key
     * @param value value
     */
    data<T>(key: string, value?: T): T | undefined {
        if (value != null) {
            // 设置数据
            this.dataSource.set(key, value)
        } else {
            // 获取数据
            return this.dataSource.get(key)
        }
    }
}

// new 一个对象
function $(selector: any): DomElement {
    return new DomElement(selector)
}

// 解绑所有事件，用于销毁编辑器
$.offAll = function (): void {
    EVENT_LIST.forEach((item: EventItem) => {
        const elem = item.elem
        const type = item.type
        const fn = item.fn
        // 解绑事件
        elem.removeEventListener(type, e => fn(e))
    })
}

export default $
