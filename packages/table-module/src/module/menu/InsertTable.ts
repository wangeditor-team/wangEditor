/**
 * @description insert table menu
 * @author wangfupeng
 */

import { Editor, Transforms, Range, Node } from 'slate'
import { IDropPanelMenu, IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../utils/dom'
import { genRandomStr } from '../../utils/util'
import { TABLE_SVG } from '../../constants/svg'

function genTableNode(rowNum: number, colNum: number) {
  // 拼接 rows
  const rows = []
  for (let i = 0; i < rowNum; i++) {
    // 拼接 cells
    const cells = []
    for (let j = 0; j < colNum; j++) {
      const cellNode = { type: 'table-cell', children: [{ text: '' }] }
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
  title = '插入表格'
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

    const [nodeEntry] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n.type === 'table',
      universal: true,
    })
    if (nodeEntry != null) return true // 当前处于 table ，禁用

    return false
  }

  /**
   *  获取 panel 内容
   * @param editor editor
   */
  getPanelContentElem(editor: IDomEditor): Dom7Array {
    // 已有，直接返回
    if (this.$content) return this.$content

    // 初始化
    const $content = $('<div class="w-e-panel-content-table"></div>')

    // 渲染 10 * 10 table
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

        // 绑定 mousedown
        $td.on('mousedown', (e: Event) => {
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

    // 记录，并返回
    this.$content = $content
    return $content
  }

  private insertTable(editor: IDomEditor, rowNumStr: string, colNumStr: string) {
    const rowNum = parseInt(rowNumStr, 10)
    const colNum = parseInt(colNumStr, 10)
    if (!rowNum || !colNum) return
    if (rowNum <= 0 || colNum <= 0) return

    // 如果当前是空 p ，则删除该 p
    const [emptyPNodeEntry] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n.type === 'paragraph',
      universal: true,
    })
    if (emptyPNodeEntry) {
      const [p] = emptyPNodeEntry
      if (Node.string(p) === '') {
        Transforms.removeNodes(editor, { mode: 'highest' })
      }
    }

    // 插入表格
    const tableNode = genTableNode(rowNum, colNum)
    Transforms.insertNodes(editor, tableNode, { mode: 'highest' })
  }
}

export default InsertTable
