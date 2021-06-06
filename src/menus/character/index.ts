/**
 * @description 插入特殊字符
 * @author liukang
 */
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import PanelMenu from '../menu-constructors/PanelMenu'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import createPanelConf from './create-panel-conf'

class Character extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="特殊字符">
                <i class="w-e-icon-character"></i>
            </div>`
        )
        super($elem, editor)
    }
    /**
     * 创建 panel
     */
    private createPanel(): void {
        const conf = createPanelConf(this.editor)
        const panel = new Panel(this, conf)
        panel.create()
    }

    /**
     * 特殊字符菜单点击事件
     */
    public clickHandler(): void {
        this.createPanel()
    }

    public tryChangeActive() {}
}

export default Character
