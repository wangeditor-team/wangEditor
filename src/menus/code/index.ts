/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import Panel from '../menu-constructors/Panel'
import Editor from '../../editor/index'
import PanelMenu from '../menu-constructors/PanelMenu'
import { MenuActive } from '../menu-constructors/Menu'
import DropListMenu from '../menu-constructors/DropListMenu'

class Code extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-terminal"></i>
            </div>`
        )

        super($elem, editor)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        editor.cmd.do('foreColor', value)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $videoElem

        // 弹出 panel
        this.createPanel('')
    }

    /**
     * 创建 panel
     * @param link 链接
     */
    private createPanel(iframe: string): void {
        //创建panel
        const panel = new Panel(this, {
            width: 300,
            height: 200,
            tabs: [
                {
                    title: '插入代码',
                    // 模板
                    tpl: `<div>
                        <textarea type="text" class="block" placeholder="格式如：<iframe src=... ></iframe>"/></textarea>
                        <div class="w-e-button-container">
                            <button id="" class="right">插入</button>
                        </div>
                    </div>`,
                    // 事件绑定
                    events: [
                        // 插入视频
                        {},
                    ],
                },
            ],
        })
        panel.create()
        this.setPanel(panel)
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default Code
