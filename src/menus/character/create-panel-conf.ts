/**
 * @description  特殊字符菜单 panel配置
 * @author liukang
 */

import Editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import $ from '../../utils/dom-core'
import { CharactersType } from '../../config/menus'

export default function (editor: Editor): PanelConf {
    // 声明characters数据结构
    const characters: Array<CharactersType> = editor.config.characters

    /* tabs配置项 ==================================================================*/

    // 生成特殊字符结构 TODO
    function GenerateExpressionStructure(ele: CharactersType) {
        // 返回为一个数组对象
        let res: string[] = []
        res = ele.content.map((con: string) => {
            return `<span class="eleCharacter" title="${con}">${con}</span>`
        })
        return res.join('').replace(/&nbsp;/g, '')
    }

    const tabsConf: PanelTabConf[] = characters.map((ele: CharactersType) => {
        return {
            title: editor.i18next.t(`menus.panelMenus.character.${ele.title}`),

            tpl: `<div>${GenerateExpressionStructure(ele)}</div>`,

            events: [
                {
                    selector: '.eleCharacter',
                    type: 'click',
                    fn: (e: Event) => {
                        // e为事件对象
                        const $target = $(e.target)
                        console.log('nodeName', $target.html())
                        let insertHtml = '<span>' + $target.html() + '</span>'
                        editor.cmd.do('insertHTML', insertHtml)
                        // 示函数执行结束之后关闭 panel
                        return true
                    },
                },
            ],
        }
    })
    /* tabs配置项 =================================================================end*/

    // 最终的配置 -----------------------------------------
    const conf: PanelConf = {
        width: 450, // Panel容器宽度
        height: 230, // Panel容器高度
        tabs: tabsConf,
    }
    return conf
}
