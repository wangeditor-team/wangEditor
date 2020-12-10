/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import Editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import { videoRegex } from '../../utils/const'

export default function (editor: Editor, video: string): PanelConf {
    // panel 中需要用到的id
    const inputIFrameId = getRandom('input-iframe')
    const btnOkId = getRandom('btn-ok')
    const i18nPrefix = 'menus.panelMenus.video.'
    const t = (text: string, prefix: string = i18nPrefix): string => {
        return editor.i18next.t(prefix + text)
    }

    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video: string): void {
        editor.cmd.do('insertHTML', video + '<p><br></p>')

        // video添加后的回调
        editor.config.onlineVideoCallback(video)
    }

    /**
     * 校验在线视频链接
     * @param video 在线视频链接
     */
    function checkOnlineVideo(video: string): boolean {
        // 编辑器进行正常校验，video 合规则使指针为true，不合规为false
        let flag = true
        if (!videoRegex.test(video)) {
            flag = false
        }

        // 查看开发者自定义配置的返回值
        const check = editor.config.onlineVideoCheck(video)
        if (check === undefined) {
            if (flag === false) console.log(t('您刚才插入的视频链接未通过编辑器校验', 'validate.'))
        } else if (check === true) {
            // 用户通过了开发者的校验
            if (flag === false) {
                editor.config.customAlert(
                    `${t('您插入的网络视频无法识别', 'validate.')}，${t(
                        '请替换为正确的网络视频格式',
                        'validate.'
                    )}：如<iframe src=...></iframe>`,
                    'warning'
                )
            } else {
                return true
            }
        } else {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            editor.config.customAlert(check, 'error')
        }
        return false
    }

    const conf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: editor.i18next.t('menus.panelMenus.video.插入视频'),
                // 模板
                tpl: `<div>
                        <input 
                            id="${inputIFrameId}" 
                            type="text" 
                            class="block" 
                            placeholder="${editor.i18next.t('如')}：<iframe src=... ></iframe>"/>
                        </td>
                        <div class="w-e-button-container">
                            <button type="button" id="${btnOkId}" class="right">
                                ${editor.i18next.t('插入')}
                            </button>
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
                            // 对当前用户插入的内容进行判断，插入为空，或者返回false，都停止插入
                            if (!checkOnlineVideo(video)) return

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
