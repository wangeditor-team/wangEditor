/**
 * @description table 菜单 panel tab 配置
 * @author lichunlin
 */

import editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import '../../assets/style/create-panel-conf.less'
import CreateTable from './create-table'

export default function (editor: editor): PanelConf {
    const createTable = new CreateTable(editor)

    // panel 中需要用到的id
    const colId = getRandom('w-col-id')
    const rowId = getRandom('w-row-id')
    const insertBtnId = getRandom('btn-link')

    const t = (text: string): string => {
        return editor.i18next.t(text)
    }
    const i18Prefix = 'menus.panelMenus.table.'

    // tabs 配置 -----------------------------------------
    const tabsConf: PanelTabConf[] = [
        {
            title: `${t('插入')} ${t(`${i18Prefix}表格`)}`,
            tpl: `<div>
                    <div class="w-e-table">
                        <span>${t('创建')}</span>
                        <input id="${rowId}"  type="text" class="w-e-table-input" value="5"/></td>
                        <span>${t(`${i18Prefix}行`)}</span>
                        <input id="${colId}" type="text" class="w-e-table-input" value="5"/></td>
                        <span>${
                            t(`${i18Prefix}列`) + t(`${i18Prefix}的`) + t(`${i18Prefix}表格`)
                        }</span>
                    </div>
                    <div class="w-e-button-container">
                        <button id="${insertBtnId}" class="right">${t('插入')}</button>
                    </div>
                </div>`,
            events: [
                {
                    selector: '#' + insertBtnId,
                    type: 'click',
                    fn: () => {
                        const colValue = Number($('#' + colId).val())
                        const rowValue = Number($('#' + rowId).val())
                        //校验是否传值
                        if (colValue && rowValue) {
                            createTable.createAction(rowValue, colValue)
                        }
                        // 返回 true 表示函数执行结束之后关闭 panel
                        return true
                    },
                },
            ],
        },
    ]
    // tabs end

    // 最终的配置 -----------------------------------------
    const conf: PanelConf = {
        width: 320,
        height: 0,
        tabs: [],
    }
    conf.tabs.push(tabsConf[0])

    return conf
}
