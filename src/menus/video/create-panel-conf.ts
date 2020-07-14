/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'

export default function (editor: editor, video: string): PanelConf {
    // panel 中需要用到的id
    const inputIFrameId = getRandom('input-iframe')
    const btnOkId = getRandom('btn-ok')

    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video: string): void {
        editor.cmd.do('insertHTML', video + '<p><br></p>')
    }

    const conf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: '插入视频',
                // 模板
                tpl: `<div>
                        <input id="${inputIFrameId}" type="text" class="block" placeholder="格式如：<iframe src=... ></iframe>"/></td>
                        <div class="w-e-button-container">
                            <button id="${btnOkId}" class="right">插入</button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    // 插入视频
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            // 执行插入视频
                            const $video = $('#' + inputIFrameId)
                            let video = $video.val().trim()

                            // 视频为空，则不插入
                            if (!video) return

                            insertVideo(video)

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                ],
            }, // tab end
        ], // tabs end
    }

    return conf
}
