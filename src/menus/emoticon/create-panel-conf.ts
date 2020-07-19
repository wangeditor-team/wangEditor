/**
 * @description  表情菜单 panel配置
 * @author liuwei
 */

import editor from '../../editor/index'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import $ from '../../utils/dom-core'
import menus, { EmotionsType, EmotionsContentType, EventsFnType } from '../../config/menus'

export default function (editor: editor): PanelConf {
    const { emotions: emotions } = menus
    /* tabs配置项 ==================================================================*/

    // 生成表情结构
    function GeneratExpressionStructure(ele: EmotionsType) {
        // 如果type是image类型则生成一个img标签
        if (ele.type == 'image') {
            return ele.content.map((con: EmotionsContentType) => {
                return `<span style="cursor: pointer;" title="${con.alt}">
             <img class="eleImg" src="${con.src}" alt="[${con.alt}]"></span>`
            })
        }

        //否则直接当内容处理
        return ele.content.map((con: EmotionsContentType) => {
            return `<span class="eleImg" style="cursor: pointer;" title="${con}">${con}</span>`
        })
    }

    const tabsConf: PanelTabConf[] = emotions.map((ele: EmotionsType) => {
        return {
            title: ele.title,
            // 判断type类型如果是image则以img的形式插入否则以内容
            tpl: `<div>${GeneratExpressionStructure(ele)}</div>`.replace(/,/g, ''),
            events: [
                {
                    selector: '.eleImg',
                    type: 'click',
                    fn: (e: EventsFnType) => {
                        // e为事件对象
                        const $target = $(e.target)
                        const nodeName = $target.getNodeName()
                        let insertHtml

                        if (nodeName === 'IMG') {
                            // 插入图片
                            insertHtml = $target.parent().html()
                        } else {
                            // 插入 emoji
                            insertHtml = '<span>' + $target.html() + '</span>'
                        }

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
        width: 300, // Panel容器宽度
        height: 230, // Panel容器高度
        tabs: tabsConf,
    }
    return conf
}
