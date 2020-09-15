/**
 * @description 分割线
 * @author wangqiaoling
 */
import BtnMenu from '../menu-constructors/BtnMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'
class splitLine extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-split-line"></i></div>')
        super($elem, editor)
        // 绑定事件
        bindEvent(editor)
    }
    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        // console.log('editor.selection', editor.selection)

        // TODO: 当将表格拖蓝时有BUG
        // TODO: 光标在图片后时，点击添加分割线，有BUG
        // TODO: 不允许在 代码块、表格、 图片、 中添加分割线
        const $selectionElem = $(editor.selection.getSelectionContainerElem())
        const $DomElement = $($selectionElem.elems[0])
        // console.log($DomElement)

        const $tableDOM = $DomElement.parentUntil('TABLE', $selectionElem.elems[0])
        const $imgDOM = $DomElement.children()

        // 禁止在代码块中添加分割线
        if ($DomElement.getNodeName() === 'CODE') return
        // 禁止在表格中添加分割线
        if ($tableDOM && $($tableDOM.elems[0]).getNodeName() === 'TABLE') return
        // 禁止在图片处添加分割线
        if ($imgDOM && $imgDOM.length !== 0 && $($imgDOM.elems[0]).getNodeName() === 'IMG') return

        this.createSplitLine()
    }
    /**
     * 创建 splitLine
     */
    private createSplitLine(): void {
        const splitLineDOM: string = `<hr class='w-e-split-line'/>`
        this.editor.cmd.do('insertHTML', splitLineDOM)
    }
    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        // const editor = this.editor
        // if (isActive(editor)) {
        //     this.active()
        // } else {
        //     this.unActive()
        // }
    }
}
export default splitLine
