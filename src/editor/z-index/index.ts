/**
 * @description z-index 管理器
 * @author fangzhicong
 */
import Editor from '../index'
import style from '../../config/style'

export default class ZIndex {
    // 层级参数
    private tier: { [propName: string]: number } = {
        menu: 2, // 显示状态下的菜单栏
        panel: 2,
        toolbar: 1, // 菜单栏父容器
        tooltip: 1, // tooltip
    }

    constructor(public editor: Editor) {}

    // 获取 tierName 对应的 z-index 的值。如果 tierName 未定义则返回默认的 z-index 值
    get(tierName?: string) {
        if (tierName && this.tier[tierName]) {
            return this.editor.config.zIndex + this.tier[tierName]
        }
        return this.editor.config.zIndex
    }

    // 设置 tierName 的层级参数。第一次设置有效
    set(tierName: string, tierValue: number) {
        if (!this.tier[tierName]) {
            this.tier[tierName] = tierValue
            return true
        }
        return false
    }

    // 设置默认值，第一次设置有效
    setDefault(value: number) {
        if (this.editor.config.zIndex == style.zIndex) {
            this.editor.config.zIndex = value
            return true
        }
        return false
    }
}
