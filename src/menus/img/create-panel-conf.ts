/**
 * @description image 菜单 panel tab 配置
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import UploadImg from './upload-img'
import { imgRegex } from '../../utils/const'

export default function (editor: Editor): PanelConf {
    const config = editor.config
    const uploadImg = new UploadImg(editor)

    // panel 中需要用到的id
    const upTriggerId = getRandom('up-trigger-id')
    const upFileId = getRandom('up-file-id')
    const linkUrlId = getRandom('input-link-url')
    const linkBtnId = getRandom('btn-link')

    const i18nPrefix = 'menus.panelMenus.image.'
    const t = (text: string, prefix: string = i18nPrefix): string => {
        return editor.i18next.t(prefix + text)
    }

    /**
     * 校验网络图片链接是否合法
     * @param linkImg 网络图片链接
     */
    function checkLinkImg(src: string): boolean {
        //编辑器进行正常校验，图片合规则使指针为true，不合规为false
        let flag = true
        if (!imgRegex.test(src)) {
            flag = false
        }

        //查看开发者自定义配置的返回值
        const check = config.linkImgCheck(src)
        if (check === undefined) {
            //用户未能通过开发者的校验，且开发者不希望编辑器提示用户
            if (flag === false) console.log(t('您刚才插入的图片链接未通过编辑器校验', 'validate.'))
        } else if (check === true) {
            //用户通过了开发者的校验
            if (flag === false) {
                config.customAlert(
                    `${t('您插入的网络图片无法识别', 'validate.')}，${t(
                        '请替换为支持的图片类型',
                        'validate.'
                    )}：jpg | png | gif ...`,
                    'warning'
                )
            } else return true
        } else {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            config.customAlert(check, 'error')
        }
        return false
    }

    // tabs 配置 -----------------------------------------
    const fileMultipleAttr = config.uploadImgMaxLength === 1 ? '' : 'multiple="multiple"'
    const accepts: string = config.uploadImgAccept.map((item: string) => `image/${item}`).join(',')
    const tabsConf: PanelTabConf[] = [
        // first tab
        {
            // 标题
            title: t('上传图片'),
            // 模板
            tpl: `<div class="w-e-up-img-container">
                    <div id="${upTriggerId}" class="w-e-up-btn">
                        <i class="w-e-icon-upload2"></i>
                    </div>
                    <div style="display:none;">
                        <input id="${upFileId}" type="file" ${fileMultipleAttr} accept="${accepts}"/>
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
            title: t('网络图片'),
            tpl: `<div>
                    <input
                        id="${linkUrlId}"
                        type="text"
                        class="block"
                        placeholder="${t('图片链接')}"/>
                    </td>
                    <div class="w-e-button-container">
                        <button type="button" id="${linkBtnId}" class="right">${t(
                '插入',
                ''
            )}</button>
                    </div>
                </div>`,
            events: [
                {
                    selector: '#' + linkBtnId,
                    type: 'click',
                    fn: () => {
                        const $linkUrl = $('#' + linkUrlId)
                        const url = $linkUrl.val().trim()

                        //如果url为空则直接返回
                        if (!url) return
                        //如果不能通过校验也直接返回
                        if (!checkLinkImg(url)) return

                        //插入图片url
                        uploadImg.insertImg(url)
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
