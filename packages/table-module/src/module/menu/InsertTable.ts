/**
 * @description insert table menu
 * @author wangfupeng
 */

import { Editor, Transforms, Range, Node } from 'slate'
import { IDropPanelMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import $, { Dom7Array, DOMElement } from '../../utils/dom'
import { genRandomStr } from '../../utils/util'
import { TABLE_SVG } from '../../constants/svg'
import { TableElement, TableCellElement, TableRowElement } from '../custom-types'

function genTableNode(rowNum: number, colNum: number): TableElement {
  // 拼接 rows
  const rows: TableRowElement[] = []
  for (let i = 0; i < rowNum; i++) {
    // 拼接 cells
    const cells: TableCellElement[] = []
    for (let j = 0; j < colNum; j++) {
      const cellNode: TableCellElement = {
        type: 'table-cell',
        children: [{ text: '' }],
      }
      if (i === 0) {
        cellNode.isHeader = true // 第一行默认是 th
      }
      cells.push(cellNode)
    }

    // 生成 row
    rows.push({
      type: 'table-row',
      children: cells,
    })
  }

  return {
    type: 'table',
    width: 'auto',
    children: rows,
  }
}

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-table')
}

class InsertTable implements IDropPanelMenu {
  title = t('tableModule.insertTable')
  iconSvg = TABLE_SVG
  tag = 'button'
  showDropPanel = true // 点击 button 时显示 dropPanel
  private $content: Dom7Array | null = null

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    const selectedElems = DomEditor.getSelectedElems(editor)
    const hasVoidOrPreOrTable = selectedElems.some(elem => {
      const type = DomEditor.getNodeType(elem)
      if (type === 'pre') return true
      if (type === 'table') return true
      if (type === 'list-item') return true
      if (editor.isVoid(elem)) return true
      return false
    })
    if (hasVoidOrPreOrTable) return true // 匹配到，禁用

    return false
  }

  /**
   *  获取 panel 内容
   * @param editor editor
   */
  getPanelContentElem(editor: IDomEditor): DOMElement {
    // 已有，直接返回
    if (this.$content) return this.$content[0]

    // 初始化
    const $content = $('<div class="w-e-panel-content-table"></div>')
    const $info = $('<span>0 &times; 0</span>') // 显示行列数量

    // 渲染 10 * 10 table ，以快速创建表格
    const $table = $('<table></table>')
    for (let i = 0; i < 10; i++) {
      const $tr = $('<tr></tr>')
      for (let j = 0; j < 10; j++) {
        const $td = $('<td></td>')
        $td.attr('data-x', j.toString())
        $td.attr('data-y', i.toString())
        $tr.append($td)

        // 绑定 mouseenter
        $td.on('mouseenter', (e: Event) => {
          const { target } = e
          if (target == null) return
          const $focusTd = $(target)
          const { x: focusX, y: focusY } = $focusTd.dataset()

          // 显示行列数量
          $info[0].innerHTML = `${focusX + 1} &times; ${focusY + 1}`

          // 修改 table td 样式
          $table.children().each(tr => {
            $(tr)
              .children()
              .each(td => {
                const $td = $(td)
                const { x, y } = $td.dataset()
                if (x <= focusX && y <= focusY) {
                  $td.addClass('active')
                } else {
                  $td.removeClass('active')
                }
              })
          })
        })

        // 绑定 click
        $td.on('click', (e: Event) => {
          e.preventDefault()
          const { target } = e
          if (target == null) return
          const $td = $(target)
          const { x, y } = $td.dataset()
          this.insertTable(editor, y + 1, x + 1)
        })
      }
      $table.append($tr)
    }
    $content.append($table)
    $content.append($info)

    // 记录，并返回
    this.$content = $content
    return $content[0]
  }

  private insertTable(editor: IDomEditor, rowNumStr: string, colNumStr: string) {
    const rowNum = parseInt(rowNumStr, 10)
    const colNum = parseInt(colNumStr, 10)
    if (!rowNum || !colNum) return
    if (rowNum <= 0 || colNum <= 0) return

    // 如果当前是空 p ，则删除该 p
    if (DomEditor.isSelectedEmptyParagraph(editor)) {
      Transforms.removeNodes(editor, { mode: 'highest' })
    }

    // 插入表格
    const tableNode = genTableNode(rowNum, colNum)
    Transforms.insertNodes(editor, tableNode, { mode: 'highest' })
  }
}

export default InsertTable
