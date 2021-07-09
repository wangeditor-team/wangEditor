/**
 * @description 处理 beforeInput 事件
 * @author wangfupeng
 */

import { Editor, Transforms, Range } from 'slate'
import { DomEditor } from '../../editor/dom-editor'
import { IDomEditor } from '../../editor/interface'
import TextArea from '../TextArea'
import { hasEditableTarget } from '../helpers'
import { DOMStaticRange } from '../../utils/dom'
import { HAS_BEFORE_INPUT_SUPPORT } from '../../utils/ua'

// 补充 beforeInput event 的属性
interface BeforeInputEventType {
  data: string | null
  dataTransfer: DataTransfer | null
  getTargetRanges(): DOMStaticRange[]
  inputType: string
  isComposing: boolean
}

function handleBeforeInput(e: Event, textarea: TextArea, editor: IDomEditor) {
  const event = e as Event & BeforeInputEventType

  if (!HAS_BEFORE_INPUT_SUPPORT) return // 有些浏览器完全不支持 beforeInput ，会用 keypress 和 keydown 兼容
  if (textarea.editorConfig.readOnly) return
  if (!hasEditableTarget(editor, event.target)) return

  const { selection } = editor
  const { inputType: type } = event
  const data = event.dataTransfer || event.data || undefined

  // These two types occur while a user is composing text and can't be
  // cancelled. Let them through and wait for the composition to end.
  if (type === 'insertCompositionText' || type === 'deleteCompositionText') {
    return
  }

  // 阻止默认行为，劫持所有的富文本输入
  event.preventDefault()

  // COMPAT: For the deleting forward/backward input types we don't want
  // to change the selection because it is the range that will be deleted,
  // and those commands determine that for themselves.
  if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
    const [targetRange] = event.getTargetRanges()

    if (targetRange) {
      const range = DomEditor.toSlateRange(editor, targetRange)
      if (!selection || !Range.equals(selection, range)) {
        Transforms.select(editor, range)
      }
    }
  }

  // COMPAT: If the selection is expanded, even if the command seems like
  // a delete forward/backward command it should delete the selection.
  if (selection && Range.isExpanded(selection) && type.startsWith('delete')) {
    const direction = type.endsWith('Backward') ? 'backward' : 'forward'
    Editor.deleteFragment(editor, { direction })
    return
  }

  // 根据 beforeInput 的 event.inputType
  switch (type) {
    case 'deleteByComposition':
    case 'deleteByCut':
    case 'deleteByDrag': {
      Editor.deleteFragment(editor)
      break
    }

    case 'deleteContent':
    case 'deleteContentForward': {
      Editor.deleteForward(editor)
      break
    }

    case 'deleteContentBackward': {
      Editor.deleteBackward(editor)
      break
    }

    case 'deleteEntireSoftLine': {
      Editor.deleteBackward(editor, { unit: 'line' })
      Editor.deleteForward(editor, { unit: 'line' })
      break
    }

    case 'deleteHardLineBackward': {
      Editor.deleteBackward(editor, { unit: 'block' })
      break
    }

    case 'deleteSoftLineBackward': {
      Editor.deleteBackward(editor, { unit: 'line' })
      break
    }

    case 'deleteHardLineForward': {
      Editor.deleteForward(editor, { unit: 'block' })
      break
    }

    case 'deleteSoftLineForward': {
      Editor.deleteForward(editor, { unit: 'line' })
      break
    }

    case 'deleteWordBackward': {
      Editor.deleteBackward(editor, { unit: 'word' })
      break
    }

    case 'deleteWordForward': {
      Editor.deleteForward(editor, { unit: 'word' })
      break
    }

    case 'insertLineBreak':
    case 'insertParagraph': {
      Editor.insertBreak(editor)
      break
    }

    case 'insertFromComposition':
    case 'insertFromDrop':
    case 'insertFromPaste':
    case 'insertFromYank':
    case 'insertReplacementText':
    case 'insertText': {
      if (data instanceof DataTransfer) {
        // 这里处理非纯文本（如 html 图片文件等）的粘贴。对于纯文本的粘贴，使用 paste 事件
        editor.insertData(data)
      } else if (typeof data === 'string') {
        Editor.insertText(editor, data)
      }
      break
    }
  }
}

export default handleBeforeInput
