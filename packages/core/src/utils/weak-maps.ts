/**
 * @description 对象关联关系（部分参考 slate-react weak-maps.ts）
 * @author wangfupeng
 */

import { Emitter } from 'event-emitter'
import { VNode } from 'snabbdom'
import { Node, Ancestor, Editor, Path, Range } from 'slate'
import { IDomEditor } from '../editor/interface'
import TextArea from '../text-area/TextArea'
import Toolbar from '../menus/bar/Toolbar'
import HoverBar from '../menus/bar/HoverBar'
import { IBarItem } from '../menus/bar-item/index'
import { Key } from './key'
import { PatchFn } from '../utils/vdom'
import { IEditorConfig } from '../config/interface'
import PanelAndModal from '../menus/panel-and-modal/BaseClass'

// textarea - editor
export const EDITOR_TO_TEXTAREA = new WeakMap<IDomEditor, TextArea>()
export const TEXTAREA_TO_EDITOR = new WeakMap<TextArea, IDomEditor>()

// bar - editor
export const TOOLBAR_TO_EDITOR = new WeakMap<Toolbar, IDomEditor>()
export const EDITOR_TO_TOOLBAR = new WeakMap<IDomEditor, Toolbar>()
export const HOVER_BAR_TO_EDITOR = new WeakMap<HoverBar, IDomEditor>()
export const EDITOR_TO_HOVER_BAR = new WeakMap<IDomEditor, HoverBar>()
export const BAR_ITEM_TO_EDITOR = new WeakMap<IBarItem, IDomEditor>()
export const EDITOR_TO_PANEL_AND_MODAL = new WeakMap<IDomEditor, Set<PanelAndModal>>()
export const PANEL_OR_MODAL_TO_EDITOR = new WeakMap<PanelAndModal, IDomEditor>()

// config
export const EDITOR_TO_CONFIG = new WeakMap<IDomEditor, IEditorConfig>()

// vdom 相关的属性
export const IS_FIRST_PATCH = new WeakMap<TextArea, boolean>()
export const TEXTAREA_TO_PATCH_FN = new WeakMap<TextArea, PatchFn>()
export const TEXTAREA_TO_VNODE = new WeakMap<TextArea, VNode>()

/**
 * Two weak maps that allow us rebuild a path given a node. They are populated
 * at render time such that after a render occurs we can always backtrack.
 */
export const NODE_TO_INDEX: WeakMap<Node, number> = new WeakMap()
export const NODE_TO_PARENT: WeakMap<Node, Ancestor> = new WeakMap()

/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */
export const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement> = new WeakMap()
export const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string> = new WeakMap()
export const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node> = new WeakMap()
export const KEY_TO_ELEMENT: WeakMap<Key, HTMLElement> = new WeakMap()
export const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement> = new WeakMap()
export const NODE_TO_KEY: WeakMap<Node, Key> = new WeakMap()
export const EDITOR_TO_WINDOW: WeakMap<Editor, Window> = new WeakMap()

/**
 * Weak maps for storing editor-related state.
 */
export const IS_FOCUSED: WeakMap<Editor, boolean> = new WeakMap()
export const IS_DRAGGING: WeakMap<Editor, boolean> = new WeakMap()
export const IS_CLICKING: WeakMap<Editor, boolean> = new WeakMap()

// /**
//  * Weak map for associating the context `onChange` context with the plugin.
//  */
// export const EDITOR_TO_ON_CHANGE = new WeakMap<Editor, () => void>()

// 正在更新，但尚未更新完的节点 path ，临时记录下
// 例如，table 插入 col ，需要一行一行的插入，在更新期间，不能收到其他的（如 normalize）干扰
export const CHANGING_NODE_PATH: WeakMap<Editor, Path> = new WeakMap()

// 保存 editor -> selection ，用于还原 editor 选区
export const EDITOR_TO_SELECTION: WeakMap<Editor, Range> = new WeakMap()

// editor -> eventEmitter 自定义事件
export const EDITOR_TO_EMITTER: WeakMap<Editor, Emitter> = new WeakMap()

// editor 是否可执行粘贴
export const EDITOR_TO_CAN_PASTE: WeakMap<Editor, boolean> = new WeakMap()
