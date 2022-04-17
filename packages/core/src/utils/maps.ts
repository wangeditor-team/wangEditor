import { DOMElement } from './dom'
import { IDomEditor } from '../editor/interface'

// 用来存储key中有基础类型的一些map

// 存储selector 对应的 editor
export const SELECTOR_TO_EDITOR = new Map<string | DOMElement, IDomEditor>()
