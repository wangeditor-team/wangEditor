/**
 * @description 视频 菜单
 * @author tonghan
 */

import $ from '../../utils/dom-core'
import Panel from '../menu-constructors/Panel'
import { EMPTY_FN } from '../../utils/const'
import Editor from '../../editor/index'
import PanelMenu from '../menu-constructors/PanelMenu'
import { MenuActive } from '../menu-constructors/Menu'
import createPanelConf, { VideoPanelConf } from './create-panel-conf'
import bindEvent from './bind-event/index'

class Video extends PanelMenu implements MenuActive {
    private videoPanelConfig: VideoPanelConf

    constructor(editor: Editor) {
        let $elem = $(
            `<div class="w-e-menu" data-title="视频">
                <i class="w-e-icon-play"></i>
            </div>`
        )

        let videoPanelConfig = createPanelConf(editor)
        if (videoPanelConfig.onlyUploadConf) {
            $elem = videoPanelConfig.onlyUploadConf.$elem
            videoPanelConfig.onlyUploadConf.events.map(event => {
                const type = event.type
                const fn = event.fn || EMPTY_FN
                $elem.on(type, (e: Event) => {
                    e.stopPropagation()
                    fn(e)
                })
            })
        }

        super($elem, editor)

        this.videoPanelConfig = videoPanelConfig

        // 绑定事件 tootip
        bindEvent(editor)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        if (!this.videoPanelConfig.onlyUploadConf) {
            this.createPanel()
        }
    }

    /**
     * 创建 panel
     * @param link 链接
     */
    private createPanel(): void {
        const conf = this.videoPanelConfig
        const panel = new Panel(this, conf)
        this.setPanel(panel)
        panel.create()
    }

    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() { }
}

export default Video
