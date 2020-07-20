/**
 * @description image 菜单 panel tab 配置
 * @author wangfupeng
 */

import editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import UploadImg from './upload-img'

export default function (editor: editor): PanelConf {
    const config = editor.config
    const uploadImg = new UploadImg(editor)

    // panel 中需要用到的id
    const upTriggerId = getRandom('up-trigger-id')
    const upFileId = getRandom('up-file-id')
    const linkUrlId = getRandom('input-link-url')
    const linkBtnId = getRandom('btn-link')

    // tabs 配置 -----------------------------------------
    const tabsConf: PanelTabConf[] = [
        // first tab
        {
            // 标题
            title: '上传图片',
            // 模板
            tpl: `<div class="w-e-up-img-container">
                    <div id="${upTriggerId}" class="w-e-up-btn">
                        <i class="w-e-icon-upload2"></i>
                    </div>
                    <div style="display:none;">
                        <input id="${upFileId}" type="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"/>
                    </div>
                </div>`,
            // 事件绑定
            events: [
                // 触发选择图片
                {
                    selector: '#' + upTriggerId,
                    type: 'click',
                    fn: () => {
                        const $file = $('#' + upFileId)
                        const fileElem = $file.elems[0]
                        if (fileElem) {
                            fileElem.click()
                        } else {
                            // 返回 true 可关闭 panel
                            return true
                        }
                    },
                },
                // 选择图片完毕
                {
                    selector: '#' + upFileId,
                    type: 'change',
                    fn: () => {
                        const $file = $('#' + upFileId)
                        const fileElem = $file.elems[0]
                        if (!fileElem) {
                            // 返回 true 可关闭 panel
                            return true
                        }

                        // 获取选中的 file 对象列表
                        const fileList = (fileElem as any).files
                        if (fileList.length) {
                            uploadImg.uploadImg(fileList)
                        }

                        // 返回 true 可关闭 panel
                        return true
                    },
                },
            ],
        }, // first tab end
        // second tab
        {
            title: '网络图片',
            tpl: `<div>
                    <input id="${linkUrlId}" type="text" class="block" placeholder="图片链接"/></td>
                    <div class="w-e-button-container">
                        <button id="${linkBtnId}" class="right">插入</button>
                    </div>
                </div>`,
            events: [
                {
                    selector: '#' + linkBtnId,
                    type: 'click',
                    fn: () => {
                        const $linkUrl = $('#' + linkUrlId)
                        const url = $linkUrl.val().trim()

                        if (url) {
                            uploadImg.insertImg(url)
                        }

                        // 返回 true 表示函数执行结束之后关闭 panel
                        return true
                    },
                },
            ],
        }, // second tab end
    ]
    // tabs end

    // 最终的配置 -----------------------------------------
    const conf: PanelConf = {
        width: 300,
        height: 0,
        tabs: [],
    }
    // 显示“上传图片”
    if (
        window.FileReader &&
        (config.uploadImgShowBase64 || config.uploadImgServer || config.customUploadImg)
    ) {
        conf.tabs.push(tabsConf[0])
    }
    // 显示“插入网络图片”
    if (config.showLinkImg) {
        conf.tabs.push(tabsConf[1])
    }

    return conf
}
