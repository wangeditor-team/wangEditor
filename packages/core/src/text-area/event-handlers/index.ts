/**
 * @description textarea event handlers entry
 * @author wangfupeng
 */

import handleBeforeInput from './beforeInput'
import handleOnBlur from './blur'
import handleOnFocus from './focus'
import handleOnClick from './click'
import { handleCompositionStart, handleCompositionEnd } from './composition'
import handleOnKeydown from './keydown'
import handleKeypress from './keypress'
import handleOnCopy from './copy'
import handleOnCut from './cut'
import handleOnPaste from './paste'
import handleOnDragover from './dragOver'
import handleOnDragstart from './dragStart'
import handleOnDrop from './drop'

const eventConf = {
  beforeinput: handleBeforeInput,
  blur: handleOnBlur,
  focus: handleOnFocus,
  click: handleOnClick,
  compositionstart: handleCompositionStart,
  compositionend: handleCompositionEnd,
  keydown: handleOnKeydown,
  keypress: handleKeypress,
  copy: handleOnCopy,
  cut: handleOnCut,
  paste: handleOnPaste,
  dragover: handleOnDragover,
  dragstart: handleOnDragstart,
  drop: handleOnDrop,
}

export default eventConf
