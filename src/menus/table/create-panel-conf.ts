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
    const rowId = getRandom('w-row-id')
    const lineId = getRandom('w-line-id')
    const insertBtnId = getRandom('btn-link')

    // tabs 配置 -----------------------------------------
    const tabsConf: PanelTabConf[] = [
        {
            title: '插入表格',
            tpl: `<div>
                    <div class="w-e-table">
                        <span>创建</span>
                        <input id="${lineId}"  type="text" class="w-e-table-input" value="5"/></td>
                        <span>行</span>
                        <input id="${rowId}" type="text" class="w-e-table-input" value="5"/></td>
                        <span>列的表格</span>
                    </div>
                    <div class="w-e-button-container">
                        <button id="${insertBtnId}" class="right">插入</button>
                    </div>
                </div>`,
            events: [
                {
                    selector: '#' + insertBtnId,
                    type: 'click',
                    fn: () => {
                        const rowValue = Number($('#' + rowId).val())
                        const lineValue = Number($('#' + lineId).val())
                        //校验是否传值
                        if (rowValue && lineValue) {
                            createTable.createAction(lineValue, rowValue)
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
        width: 270,
        height: 0,
        tabs: [],
    }
    conf.tabs.push(tabsConf[0])

    return conf
}
