/**
 * @description 查找替换的面板
 * @author TanShun
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor'
import { getRandom } from '../../utils/util'
import { PanelConf } from '../menu-constructors/Panel'
import FinderManager from './finder-manager'

export default function (editor: Editor, text: string): PanelConf {
    const inputFindId = getRandom('input-replace-find')
    const inputReplaceId = getRandom('input-replace-replace')
    const btnNextId = getRandom('btn-next')
    const btnReplaceId = getRandom('btn-replace')
    const btnReplaceAllId = getRandom('btn-replace-all')

    const finderManager = new FinderManager(editor)

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
                            placeholder="${editor.i18next.t('menus.panelMenus.replace.查找项')}"/>
                        <input
                            id="${inputReplaceId}"
                            type="text"
                            class="block"
                            value=""
                            placeholder="${editor.i18next.t('menus.panelMenus.replace.替换项')}"/>
                        <div class="w-e-button-container">
                            <button type="button" id="${btnReplaceAllId}" class="right">
                                ${editor.i18next.t('menus.panelMenus.replace.全部替换')}
                            </button>
                            <button type="button" id="${btnReplaceId}" class="right">
                                ${editor.i18next.t('menus.panelMenus.replace.替换')}
                            </button>
                            <button type="button" id="${btnNextId}" class="right">
                                ${editor.i18next.t('menus.panelMenus.replace.查找')}
                            </button>
                        </div>
                    </div>`,
                title: editor.i18next.t('menus.panelMenus.replace.替换'),
                events: [
                    {
                        selector: `#${btnNextId}`,
                        type: 'click',
                        fn() {
                            let searchValue: string = $(`#${inputFindId}`).val()

                            // 查找框内容为空时不做任何操作，且不关闭面板
                            if (searchValue == '') return
                            let result = finderManager.next(searchValue)

                            if (result != null) {
                                finderManager.createSelection(result)
                            } else {
                                return true // 关闭面板
                            }
                        },
                    },
                    {
                        selector: `#${btnReplaceId}`,
                        type: 'click',
                        fn() {
                            let searchValue: string = $(`#${inputFindId}`).val()

                            // 查找框内容为空时不做任何操作，且不关闭面板
                            if (searchValue == '') return

                            const replaceValue = $(`#${inputReplaceId}`).val()
                            let result = finderManager.getSelectionResult()

                            if (finderManager.getSearchValue() == searchValue && result != null) {
                                // 替换选区内文字
                                finderManager.replace(result, replaceValue)
                            }

                            result = finderManager.next(searchValue)

                            if (result != null) {
                                finderManager.createSelection(result)
                            } else {
                                return true // 关闭面板
                            }
                        },
                    },
                    {
                        selector: `#${btnReplaceAllId}`,
                        type: 'click',
                        fn() {
                            let searchValue: string = $(`#${inputFindId}`).val()

                            // 查找框内容为空时不做任何操作，且不关闭面板
                            if (searchValue == '') return

                            const replaceValue = $(`#${inputReplaceId}`).val()

                            let result = finderManager.getSelectionResult()

                            if (finderManager.getSearchValue() == searchValue && result != null) {
                                // 替换选区内文字
                                finderManager.replace(result, replaceValue)
                            }

                            while ((result = finderManager.next(searchValue)) != null) {
                                finderManager.replace(result, replaceValue)
                            }
                            return true // 关闭面板
                        },
                    },
                ],
            },
        ],
    }
    return conf
}
