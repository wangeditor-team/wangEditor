/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import Editor from '../../editor/index'
import { PanelConf, PanelTabConf, TabEventConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $, { DomElement } from '../../utils/dom-core'
import UploadVideo from './upload-video'
import { EMPTY_P } from '../../utils/const'

export type VideoPanelConf = {
    onlyUploadConf?: {
        $elem: DomElement
        events: TabEventConf[]
    }
} & PanelConf

export default function (editor: Editor): VideoPanelConf {
    const config = editor.config
    const uploadVideo = new UploadVideo(editor)

    // panel 中需要用到的id
    const inputIFrameId = getRandom('input-iframe')
    const btnOkId = getRandom('btn-ok')
    const inputUploadId = getRandom('input-upload')
    const btnStartId = getRandom('btn-local-ok')

    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video: string): void {
        editor.cmd.do('insertHTML', video + EMPTY_P)

        // video添加后的回调
        editor.config.onlineVideoCallback(video)
    }

    /**
     * 校验在线视频链接
     * @param video 在线视频链接
     */
    function checkOnlineVideo(video: string): boolean {
        // 查看开发者自定义配置的返回值
        const check = editor.config.onlineVideoCheck(video)
        if (check === true) {
            return true
        }
        if (typeof check === 'string') {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            editor.config.customAlert(check, 'error')
        }
        return false
    }

    /**
     * 设置模板的类名和icon图标
     * w-e-menu是作为button菜单的模板
     * w-e-up-img-container是做为panel菜单的窗口内容的模板
     * @param containerClass 模板最外层的类名
     * @param iconClass 模板中icon的类名
     * @param titleName 模板中标题的名称 需要则设置不需要则设为空字符
     */
    const getUploadVideoTpl = (containerClass: string, iconClass: string, titleName: string) =>
        `<div class="${containerClass}" data-title="${titleName}">
            <div id="${btnStartId}" class="w-e-up-btn">
                <i class="${iconClass}"></i>
            </div>
            <div style="display:none;">
                <input id="${inputUploadId}" type="file" accept="video/*"/>
            </div>
        </div>`

    const uploadEvents = [
        // 触发选择视频
        {
            selector: '#' + btnStartId,
            type: 'click',
            fn: () => {
                const $file = $('#' + inputUploadId)
                const fileElem = $file.elems[0]
                if (fileElem) {
                    fileElem.click()
                } else {
                    // 返回 true 可关闭 panel
                    return true
                }
            },
        },
        // 选择视频完毕
        {
            selector: '#' + inputUploadId,
            type: 'change',
            fn: () => {
                const $file = $('#' + inputUploadId)
                const fileElem = $file.elems[0]
                if (!fileElem) {
                    // 返回 true 可关闭 panel
                    return true
                }

                // 获取选中的 file 对象列表
                const fileList = (fileElem as any).files
                if (fileList.length) {
                    uploadVideo.uploadVideo(fileList)
                }

                // 返回 true 可关闭 panel
                return true
            },
        },
    ]

    // tabs配置
    // const fileMultipleAttr = config.uploadVideoMaxLength === 1 ? '' : 'multiple="multiple"'
    const tabsConf: PanelTabConf[] = [
        {
            // tab 的标题
            title: editor.i18next.t('menus.panelMenus.video.上传视频'),
            tpl: getUploadVideoTpl('w-e-up-video-container', 'w-e-icon-upload2', ''),
            events: uploadEvents
        },
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
                    bindEnter: true,
                },
            ],
        }, // tab end
    ]

    const conf: VideoPanelConf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [], // tabs end
        onlyUploadConf: {
            $elem: $(getUploadVideoTpl('w-e-menu', 'w-e-icon-play', '视频')),
            events: uploadEvents,
        },
    }

    // 显示“上传视频”
    if (window.FileReader && (config.uploadVideoServer || config.customUploadVideo)) {
        conf.tabs.push(tabsConf[0])
    }
    // 显示“插入视频”
    if (config.showLinkVideo) {
        conf.tabs.push(tabsConf[1])
        conf.onlyUploadConf = undefined
    }

    return conf
}
