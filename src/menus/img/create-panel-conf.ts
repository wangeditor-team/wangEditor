/**
 * @description image 菜单 panel tab 配置
 * @author wangfupeng
 */

import editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import UploadImg from './upload-img'
import linkImgCheck from '../../config/linkImgCheck'

export default function (editor: editor): PanelConf {
    const config = editor.config
    const uploadImg = new UploadImg(editor)

    // panel 中需要用到的id
    const upTriggerId = getRandom('up-trigger-id')
    const upFileId = getRandom('up-file-id')
    const linkUrlId = getRandom('input-link-url')
    const linkBtnId = getRandom('btn-link')

    /**
     * 校验网络图片链接是否合法
     * @param linkImg 网络图片链接
     */
    function linkImgCheck(src: string): boolean {
        const check = editor.config.linkImgCheck(src)
        if (check == undefined) {
            //用户未能通过开发者的校验，开发者自定义提示方式，编辑器无需重复校验，也不必执行链接插入
        } else if (check == true) {
            //用户通过了开发者的校验，编辑器正常校验，并提示
            if (!/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(src)) {
                alert('您插入的网络图片无法识别，请替换为支持的图片类型，如jpg,png,gif等')
            } else {
                return true
            }
        } else {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            alert(check)
        }
        return false
    }

    // tabs 配置 -----------------------------------------
    const tabsConf: PanelTabConf[] = [
        // first tab
        {
            // 标题
            title: editor.i18next.t('menus.panelMenus.image.上传图片'),
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
            title: editor.i18next.t('menus.panelMenus.image.网络图片'),
            tpl: `<div>
                    <input 
                        id="${linkUrlId}" 
                        type="text" 
                        class="block"
                        placeholder="${editor.i18next.t('menus.panelMenus.image.图片链接')}"/>
                    </td>
                    <div class="w-e-button-container">
                        <button id="${linkBtnId}" class="right">${editor.i18next.t('插入')}</button>
                    </div>
                </div>`,
            events: [
                {
                    selector: '#' + linkBtnId,
                    type: 'click',
                    fn: () => {
                        const $linkUrl = $('#' + linkUrlId)
                        const url = $linkUrl.val().trim()

                        //如果url非空且合法就插入
                        if (!(url && linkImgCheck(url))) return
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
