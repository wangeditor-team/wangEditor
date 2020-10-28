/**
 * @description 对齐方式
 * @author liuwei
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'

class Justify extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"></i></div>')

        const dropListConf = {
            width: 100,
            title: '对齐方式',
            type: 'list', // droplist 以列表形式展示
            list: [
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-left w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.靠左')}
                        </p>`
                    ),
                    value: 'justifyLeft',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-center w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.居中')}
                        </p>`
                    ),
                    value: 'justifyCenter',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-right w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.靠右')}
                        </p>`
                    ),
                    value: 'justifyRight',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-justify w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.两端')}
                        </p>`
                    ),
                    value: 'justifyFull',
                },
            ],
            clickHandler: (value: string) => {
                // 执行对应的value操作
                this.command(value)
            },
        }
        super($elem, editor, dropListConf)
    }
    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const selection = editor.selection
        const $selectionElem = selection.getSelectionContainerElem()
        // 保存选区
        selection.saveRange()
        // 定义对齐方式的type
        type justifyType = {
            [key: string]: string
        }
        // 数据项
        const justifyClass: justifyType = {
            justifyLeft: 'left',
            justifyCenter: 'center',
            justifyRight: 'right',
            justifyFull: 'justify',
        }
        // 获取顶级元素
        const $elems = editor.selection.getSelectionRangeTopNodes(editor)
        // 选区等于textElem时表示选择了多个段落
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            // 获取在css中对应style的值
            const justifyValue = justifyClass[value]
            $elems.forEach((el: DomElement) => {
                el.css('text-align', justifyValue)
            })
        } else {
            // 如果单行的使用execcommand实现
            editor.cmd.do(value, value)
        }
        //恢复选区
        selection.restoreSelection()
    }

    /**
     * 尝试改变菜单激活（高亮）状态
     * 默认左对齐,若选择其他对其方式对active进行高亮否则unActive
     * ?考虑优化的话 是否可以对具体选中的进行高亮
     */
    public tryChangeActive(): void {
        // const editor = this.editor
        // let isjustify = ['justifyCenter', 'justifyRight'].some(e => editor.cmd.queryCommandState(e))
        // if (isjustify) {
        //     this.active()
        // } else {
        //     this.unActive()
        // }
    }
}

export default Justify
