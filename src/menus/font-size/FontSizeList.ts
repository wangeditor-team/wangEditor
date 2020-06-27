/**
 * @description 字号 class
 * @author lkw
 */
import $, { DomElement } from '../../utils/dom-core'

export type DroListItem = {
    $elem: DomElement
    value: string
}

/**
 * 封装的一个字号菜单列表数据的组装对象,
 * 原因是因为在constructor函数中,直接执行此流程,会让代码量看起来较多,
 * 如果要在constructor调用外部函数,个人目前发现会有错误提示,
 * 因此,想着顺便研究实践下ts,遍创建了这样一个类
 */
class FontSizeList {
    private itemList: DroListItem[]

    constructor(list: DroListItem[]) {
        this.itemList = []
        list.forEach(fontValue => {
            this.itemList.push({
                $elem: $(`<p style="font-size:${fontValue.$elem}">${fontValue.$elem}</p>`),
                value: fontValue.value,
            })
        })
    }

    public getItemList(): DroListItem[] {
        return this.itemList
    }
}

export default FontSizeList
