/**
 * @description 文字替换
 * @author TanShun
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor'
import { getRandom } from '../../utils/util'
import { PanelConf } from '../menu-constructors/Panel'

export default function (editor: Editor, text: string): PanelConf {
    const inputFindId = getRandom('input-replace-find')
    const inputReplaceId = getRandom('input-replace-replace')
    const btnOkId = getRandom('btn-replace-all')

    const conf: PanelConf = {
        width: 300, // Panel容器宽度
        height: 0, // Panel容器高度
        tabs: [
            {
                tpl: `<div>
                        <input
                            id="${inputFindId}"
                            type="text"
                            class="block"
                            value="${text}"
                            placeholder="${editor.i18next.t('menus.panelMenus.replace.查找')}"/>
                        <input
                            id="${inputReplaceId}"
                            type="text"
                            class="block"
                            value=""
                            placeholder="${editor.i18next.t('menus.panelMenus.replace.替换')}"/>
                        <div class="w-e-button-container">
                            <button type="button" id="${btnOkId}" class="right">
                                ${editor.i18next.t('menus.panelMenus.replace.全部替换')}
                            </button>
                        </div>
                    </div>`,
                title: editor.i18next.t('menus.panelMenus.replace.替换'),
                events: [
                    {
                        selector: `#${btnOkId}`,
                        type: 'click',
                        fn() {
                            let findValue: string = $(`#${inputFindId}`).val()

                            // 查找框内容为空时不做任何操作，且不关闭面板
                            if (findValue == '') return

                            editor.txt.html(
                                (editor.txt.html() as string).replace(
                                    new RegExp(findValue, 'g'),
                                    $(`#${inputReplaceId}`).val()
                                )
                            )
                            return true // 关闭面板
                        },
                    },
                ],
            },
        ],
    }
    return conf
}
