/**
 * @description range变化
 * @author liuwei
 */
import Editor from '../index'
export default class RangeChange {
    constructor(public editor: Editor) {
        //  选取变化事件
        document.onselectionchange = (e: Event) => {
            const className = document.activeElement?.className
            if (className === 'w-e-text') {
                this.emit()
            }
        }
    }
    public emit(): void {
        // 执行rangeChange函数
        this.editor.txt.eventHooks.rangeChangeEvents.forEach(fn => fn())
    }
}
