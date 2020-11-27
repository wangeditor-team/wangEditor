/**
 * @description 标题
 * @author wangfupeng
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import { getRandomCode } from '../../utils/util'
import { TCatalog } from '../../config/events'

class Head extends DropListMenu implements MenuActive {
    oldCatalogs: TCatalog[] | undefined
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-header"></i></div>')
        const dropListConf = {
            width: 100,
            title: '设置标题',
            type: 'list', // droplist 以列表形式展示
            list: [
                { $elem: $('<h1>H1</h1>'), value: '<h1>' },
                { $elem: $('<h2>H2</h2>'), value: '<h2>' },
                { $elem: $('<h3>H3</h3>'), value: '<h3>' },
                { $elem: $('<h4>H4</h4>'), value: '<h4>' },
                { $elem: $('<h5>H5</h5>'), value: '<h5>' },
                {
                    $elem: $(`<p>${editor.i18next.t('menus.dropListMenu.head.正文')}</p>`),
                    value: '<p>',
                },
            ],
            clickHandler: (value: string) => {
                // 注意 this 是指向当前的 Head 对象
                this.command(value)
            },
        }
        super($elem, editor, dropListConf)

        const onCatalogChange = editor.config.onCatalogChange
        // 未配置目录change监听回调时不运行下面操作
        if (onCatalogChange) {
            this.oldCatalogs = []
            this.addListenerCatalog() // 监听文本框编辑时的大纲信息
            this.getCatalogs() // 初始有值的情况获取一遍大纲信息
        }
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const $selectionElem = editor.selection.getSelectionContainerElem()
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            // 不能选中多行来设置标题，否则会出现问题
            // 例如选中的是 <p>xxx</p><p>yyy</p> 来设置标题，设置之后会成为 <h1>xxx<br>yyy</h1> 不符合预期
            return
        }

        editor.cmd.do('formatBlock', value)

        // 标题设置成功且不是<p>正文标签就配置大纲id
        value !== '<p>' && this.addUidForSelectionElem()
    }

    /**
     * 为标题设置大纲
     */
    private addUidForSelectionElem() {
        const editor = this.editor
        const tag = editor.selection.getSelectionContainerElem()
        const id = getRandomCode() // 默认五位数id
        $(tag).attr('id', id)
    }

    /**
     * 监听change事件来返回大纲信息
     */
    private addListenerCatalog() {
        const editor = this.editor
        editor.txt.eventHooks.changeEvents.push(() => {
            this.getCatalogs()
        })
    }

    /**
     * 获取大纲数组
     */
    private getCatalogs() {
        const editor = this.editor
        const $textElem = this.editor.$textElem
        const onCatalogChange = editor.config.onCatalogChange
        const elems = $textElem.find('h1,h2,h3,h4,h5')
        const catalogs: TCatalog[] = []
        elems.forEach((elem, index) => {
            const $elem = $(elem)
            let id = $elem.attr('id')
            const tag = $elem.getNodeName()
            const text = $elem.text()
            if (!id) {
                id = getRandomCode()
                $elem.attr('id', id)
            }
            // 标题为空的情况不生成目录
            if (!text) return
            catalogs.push({
                tag,
                id,
                text,
            })
        })
        // 旧目录和新目录对比是否相等，不相等则运行回调并保存新目录到旧目录变量，以方便下一次对比
        if (JSON.stringify(this.oldCatalogs) !== JSON.stringify(catalogs)) {
            this.oldCatalogs = catalogs
            onCatalogChange && onCatalogChange(catalogs)
        }
    }

    /**
     * 尝试改变菜单激活（高亮）状态
     */
    public tryChangeActive() {
        const editor = this.editor
        const reg = /^h/i
        const cmdValue = editor.cmd.queryCommandValue('formatBlock')
        if (reg.test(cmdValue)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Head
