/**
 * @description 监听 onKeydown 事件
 * @author wangfupeng
 */

import { isHotkey } from 'is-hotkey'
import { Editor, Transforms, Range, Node, Element } from 'slate'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import Hotkeys from '../../utils/hotkeys'
import { hasEditableTarget } from '../helpers'
import { HAS_BEFORE_INPUT_SUPPORT, IS_CHROME, IS_SAFARI } from '../../utils/ua'
import { EDITOR_TO_TOOLBAR, EDITOR_TO_HOVER_BAR } from '../../utils/weak-maps'

function preventDefault(event: Event) {
  event.preventDefault()
}

// 触发 menu 快捷键
function triggerMenuHotKey(editor: IDomEditor, event: KeyboardEvent) {
  const toolbar = EDITOR_TO_TOOLBAR.get(editor)
  const toolbarMenus = toolbar && toolbar.getMenus()
  const hoverbar = EDITOR_TO_HOVER_BAR.get(editor)
  const hoverbarMenus = hoverbar && hoverbar.getMenus()

  // 合并所有 menus
  const allMenus = { ...toolbarMenus, ...hoverbarMenus }
  for (let key in allMenus) {
    const menu = allMenus[key]
    const { hotkey } = menu
    if (hotkey && isHotkey(hotkey, event)) {
      const disabled = menu.isDisabled(editor)
      if (!disabled) {
        const val = menu.getValue(editor)
        menu.exec(editor, val) // 执行 menu 命令
      }
    }
  }
}

function handleOnKeydown(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as KeyboardEvent
  const { selection } = editor
  const { readOnly } = editor.getConfig()

  if (readOnly) return
  if (textarea.isComposing) return
  if (!hasEditableTarget(editor, event.target)) return

  // 触发 menu 快捷键
  triggerMenuHotKey(editor, event)

  // tab
  if (Hotkeys.isTab(event)) {
    preventDefault(event)
    editor.handleTab()
    return
  }

  // COMPAT: Since we prevent the default behavior on
  // `beforeinput` events, the browser doesn't think there's ever
  // any history stack to undo or redo, so we have to manage these
  // hotkeys ourselves. (2019/11/06)
  if (Hotkeys.isRedo(event)) {
    preventDefault(event)
    if (typeof editor.redo === 'function') {
      editor.redo()
    }
    return
  }
  if (Hotkeys.isUndo(event)) {
    preventDefault(event)
    if (typeof editor.undo === 'function') {
      editor.undo()
    }
    return
  }

  // COMPAT: Certain browsers don't handle the selection updates
  // properly. In Chrome, the selection isn't properly extended.
  // And in Firefox, the selection isn't properly collapsed.
  // (2017/10/17)
  if (Hotkeys.isMoveLineBackward(event)) {
    preventDefault(event)
    Transforms.move(editor, { unit: 'line', reverse: true }) // Transforms.move 修改 selection
    return
  }
  if (Hotkeys.isMoveLineForward(event)) {
    preventDefault(event)
    Transforms.move(editor, { unit: 'line' })
    return
  }

  if (Hotkeys.isExtendLineBackward(event)) {
    preventDefault(event)
    Transforms.move(editor, { unit: 'line', edge: 'focus', reverse: true })
    return
  }
  if (Hotkeys.isExtendLineForward(event)) {
    preventDefault(event)
    Transforms.move(editor, { unit: 'line', edge: 'focus' })
    return
  }

  // COMPAT: If a void node is selected, or a zero-width text node
  // adjacent to an inline is selected, we need to handle these
  // hotkeys manually because browsers won't be able to skip over
  // the void node with the zero-width space not being an empty
  // string.
  // todo 移动 word 考虑 Node 排版模式是否为 rtl 的情况
  if (Hotkeys.isMoveBackward(event)) {
    preventDefault(event)

    if (selection && Range.isCollapsed(selection)) {
      Transforms.move(editor, { reverse: true })
    } else {
      Transforms.collapse(editor, { edge: 'start' })
    }
    return
  }
  if (Hotkeys.isMoveForward(event)) {
    preventDefault(event)

    if (selection && Range.isCollapsed(selection)) {
      Transforms.move(editor)
    } else {
      Transforms.collapse(editor, { edge: 'end' })
    }
    return
  }

  if (Hotkeys.isMoveWordBackward(event)) {
    preventDefault(event)

    if (selection && Range.isExpanded(selection)) {
      Transforms.collapse(editor, { edge: 'focus' })
    }

    Transforms.move(editor, { unit: 'word', reverse: true })
    return
  }
  if (Hotkeys.isMoveWordForward(event)) {
    preventDefault(event)

    if (selection && Range.isExpanded(selection)) {
      Transforms.collapse(editor, { edge: 'focus' })
    }

    Transforms.move(editor, { unit: 'word' })
    return
  }

  if (Hotkeys.isSelectAll(event)) {
    preventDefault(event)
    editor.selectAll()
    return
  }

  // COMPAT: Certain browsers don't support the `beforeinput` event, so we
  // fall back to guessing at the input intention for hotkeys.
  // COMPAT: In iOS, some of these hotkeys are handled in the
  if (!HAS_BEFORE_INPUT_SUPPORT) {
    // 这里是兼容不完全支持 beforeInput 的浏览器。对于支持 beforeInput 的浏览器，会用 beforeinput 事件处理
    // 这里兼容了 beforeInput 的一些功能键（如回车、删除等）没有文本输入。文本输入使用 keypress 兼容。

    // We don't have a core behavior for these, but they change the
    // DOM if we don't prevent them, so we have to.
    if (Hotkeys.isBold(event) || Hotkeys.isItalic(event) || Hotkeys.isTransposeCharacter(event)) {
      preventDefault(event)
      return
    }

    if (Hotkeys.isSplitBlock(event)) {
      preventDefault(event)
      Editor.insertBreak(editor)
      return
    }

    if (Hotkeys.isDeleteBackward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'backward' })
      } else {
        Editor.deleteBackward(editor)
      }
      return
    }
    if (Hotkeys.isDeleteForward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'forward' })
      } else {
        Editor.deleteForward(editor)
      }
      return
    }

    if (Hotkeys.isDeleteLineBackward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'backward' })
      } else {
        Editor.deleteBackward(editor, { unit: 'line' })
      }
      return
    }
    if (Hotkeys.isDeleteLineForward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'forward' })
      } else {
        Editor.deleteForward(editor, { unit: 'line' })
      }
      return
    }

    if (Hotkeys.isDeleteWordBackward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'backward' })
      } else {
        Editor.deleteBackward(editor, { unit: 'word' })
      }
      return
    }
    if (Hotkeys.isDeleteWordForward(event)) {
      preventDefault(event)
      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor, { direction: 'forward' })
      } else {
        Editor.deleteForward(editor, { unit: 'word' })
      }
      return
    }
  } else {
    if (IS_CHROME || IS_SAFARI) {
      // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
      // an event when deleting backwards in a selected void inline node
      // 修复在 Chrome 和 Safari 中删除内容时，内联空节点被选中
      if (
        selection &&
        (Hotkeys.isDeleteBackward(event) || Hotkeys.isDeleteForward(event)) &&
        Range.isCollapsed(selection)
      ) {
        const currentNode = Node.parent(editor, selection.anchor.path)

        if (
          Element.isElement(currentNode) &&
          Editor.isVoid(editor, currentNode) &&
          Editor.isInline(editor, currentNode)
        ) {
          event.preventDefault()
          Transforms.delete(editor, { unit: 'block' })

          return
        }
      }
    }
  }
}

export default handleOnKeydown
