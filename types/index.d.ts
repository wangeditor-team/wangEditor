export default class WangEditor {
  constructor(toolbarSelector: Selector, textSelector?: Selector)

  readonly $toolbarElem: DomElement
  readonly $textContainerElem: DomElement
  readonly $textElem: DomElement
  toolbarElemId: string
  textElemId: string

  customConfig: {
    menus: string[]
    fontNames: string[]
    colors: string[]
    debug: boolean
    zIndex: number
    lang: { [key: string]: string }
    pasteFilterStyle: boolean
    pasteIgnoreImg: boolean
    showLinkImg: boolean
    uploadImgMaxSize: number

    pasteTextHandle(content: string): string
    linkCheck(text: string, link: string): boolean | string
    linkImgCheck(src: string): boolean | string

    onchange(html: string): void
    onfocus(html: string): void
    onblur(html: string): void
  }

  txt: {
    init(): void
    clear(): void
    text(val: string): void
    text(): string
    html(val: string): void
    html(): string
    getJSON(): string
    append(html: string): void
  }

  create(): void
  initSelection(newLine: boolean): void
}

interface DomElement {
  forEach(fn: (elem: Element, index: number) => void): DomElement
  clone(deep: boolean): DomElement
  get(index: number): DomElement
  first(): DomElement
  last(): DomElement
  on(type: string, selector: string, fn: (e: Event) => void): DomElement
  off(type: string, fn: (e: Event) => void): DomElement
  attr(key: string, val: AttrVal): DomElement
  addClass(className: string): DomElement
  removeClass(className: string): DomElement
  css(key: string, val: AttrVal): DomElement
  show(): DomElement
  hide(): DomElement
  parent(): DomElement
  parentUntil(selector: string): DomElement
  children(): DomElement
  childNodes(): DomElement
  append(children: DomElement): DomElement
  remove(): DomElement
  isContain(child: DomElement): boolean
  getSizeData(): DOMRect
  getNodeName(): string
  find(selector: string): DOMRect
  text(val: string): DomElement
  text(): string
  html(val: string): DomElement
  html(): string
  val(): string
  focus(): DomElement
  equal(val: DomElement): boolean
  insertBefore(selector: Selector): DomElement
  insertAfter(selector: Selector): DomElement
  offAll(): void
}

type Selector = string | Element | DomElement
type AttrVal = string | boolean | number
