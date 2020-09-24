/**
 * @description 撤销 undo redo操作
 * @author lkw
 */

import Editor from './index'

/**
 * 撤销类
 */
class Undo {
    // 撤销栈
    public undoStack: string[]
    // 重做栈
    public redoStack: string[]
    // 记录缓存
    private undoString: string = ''
    /**
     * 操作标示 true | false
     * (因撤销操作需要使用html方法赋值,所以使用falg的方式区分撤销操作状态,屏蔽change的记录行为)
     * 记录撤销操作的状态,true为操作中,false为未在操作,默认值为false
     * 当值为true时,说明撤销操作正在进行,此时onchange事件不进行撤销文本的记录
     * 当值为false是,说明未在执行撤销操作,此时onchange正常记录撤销文本,推入undo栈
     */
    private flag: boolean
    // 编辑器实例
    public editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
        // 初始化撤销栈
        this.undoStack = []
        // 初始化重做栈
        this.redoStack = []
        // 初始化操作标示
        this.flag = false

        // 初始化缓存字符串与撤销栈
        setTimeout(() => {
            const str = editor.txt.html()
            if (typeof str === 'string') {
                this.undoString = str
            }
        }, 0)

        // change钩子
        editor.txt.eventHooks.changeEvents.push(() => {
            this.afterChange()
        })
    }

    public undo(): string {
        // 获取undo最后一位元素
        const last = this.undoStack.pop()
        const limit = this.editor.config.undoLimit
        // 类型判断
        if (typeof last !== 'string') return ''

        // 更新标示为true,change不执行记录
        this.flag = true

        // redo 入栈
        this.redoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.undoStack.length > limit) this.undoStack.shift()

        // 更新缓存
        this.undoString = last

        // 设置文本内容
        this.editor.txt.html(last)

        // 返回设置文本
        return last
    }

    public redo(): string {
        // 获取redo第一个文本
        const first = this.redoStack.pop()
        const limit = this.editor.config.undoLimit

        // 类型判断
        if (typeof first !== 'string') return ''

        // 更新标示为true,change不执行记录
        this.flag = true

        // undo 入栈
        this.undoStack.push(this.undoString)

        // 超出长度 出列
        if (limit && this.redoStack.length > limit) this.redoStack.shift()

        // 更新缓存
        this.undoString = first
        // 设置文本
        this.editor.txt.html(first)

        // 返回设置文本
        return first
    }

    public afterChange() {
        // 获取文本内容
        const str = this.editor.txt.html()

        // 类型不符
        if (typeof str !== 'string') return false

        // 判断标示 是否正在执行撤销操作
        if (this.flag) {
            // 更新标示
            this.flag = false
            // 不执行记录操作
            return false
        }

        // 缓存推入撤销栈
        this.undoStack.push(this.undoString)

        // 更新缓存
        this.undoString = str

        // 清空重做栈
        this.redoStack.length = 0

        // 更新标示为false,change正常记录
        this.flag = false
    }
}

export default Undo
