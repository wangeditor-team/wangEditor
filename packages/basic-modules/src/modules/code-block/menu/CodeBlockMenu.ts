/**
 * @description insert code-block menu
 * @author wangfupeng
 */

import { Editor, Element, Transforms, Node, Range } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { CODE_BLOCK_SVG } from '../../../constants/icon-svg'
import { CodeElement } from '../custom-types'

class CodeBlockMenu implements IButtonMenu {
  readonly title = t('codeBlock.title')
  readonly iconSvg = CODE_BLOCK_SVG
  readonly tag = 'button'

  private getSelectCodeElem(editor: IDomEditor): CodeElement | null {
    const codeNode = DomEditor.getSelectedNodeByType(editor, 'code')
    if (codeNode == null) return null
    const preNode = DomEditor.getParentNode(editor, codeNode)
    if (preNode == null) return null
    if (DomEditor.getNodeType(preNode) !== 'pre') return null

    return codeNode as CodeElement
  }

  /**
   * 获取语言类型
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const elem = this.getSelectCodeElem(editor)
    if (elem == null) return ''
    return elem.language || ''
  }

  isActive(editor: IDomEditor): boolean {
    const elem = this.getSelectCodeElem(editor)
    return !!elem
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true

    const selectedElems = DomEditor.getSelectedElems(editor)

    const hasVoid = selectedElems.some(elem => editor.isVoid(elem))
    if (hasVoid) return true

    const isMatch = selectedElems.some(elem => {
      const type = DomEditor.getNodeType(elem)
      if (type === 'pre' || type === 'paragraph') return true // 匹配 pre 或 paragraph
    })
    if (isMatch) return false // 匹配到，则 enable
    return true // 否则 disable
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const active = this.isActive(editor)
    if (active) {
      // 当前处于 code-block ，需要转换为普通文本
      this.changeToPlainText(editor)
    } else {
      // 当前未处于 code-block ，需要转换为 code-block
      this.changeToCodeBlock(editor, value.toString())
    }
  }

  private changeToPlainText(editor: IDomEditor) {
    const elem = this.getSelectCodeElem(editor)
    if (elem == null) return

    // 获取 code 文本
    const str = Node.string(elem)

    // 删除当前最高层级的节点，即 pre 节点
    Transforms.removeNodes(editor, { mode: 'highest' })

    // 插入 p 节点
    const pList = str.split('\n').map(s => {
      return { type: 'paragraph', children: [{ text: s }] }
    })
    Transforms.insertNodes(editor, pList, { mode: 'highest' })
  }

  private changeToCodeBlock(editor: IDomEditor, language: string) {
    // 汇总选中的最高层级节点的字符串
    const strArr: string[] = []
    const nodeEntries = Editor.nodes(editor, {
      match: n => editor.children.includes(n as Element), // 匹配选中的最高层级的节点
      universal: true,
    })
    for (let nodeEntry of nodeEntries) {
      const [n] = nodeEntry
      if (n) strArr.push(Node.string(n))
    }

    // 删除选中的最高层级的节点
    Transforms.removeNodes(editor, { mode: 'highest' })

    // 插入 pre 节点
    const newPreNode = {
      type: 'pre',
      children: [
        {
          type: 'code',
          language,
          children: [
            { text: strArr.join('\n') }, // 选中节点的纯文本
          ],
        },
      ],
    }
    Transforms.insertNodes(editor, newPreNode, { mode: 'highest' })
  }
}

export default CodeBlockMenu
