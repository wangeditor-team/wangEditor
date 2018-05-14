export default class WangEditor {
  constructor(toolbarSelector: Selector, textSelector?: Selector)

  readonly $toolbarElem: DomElement
  readonly $textContainerElem: DomElement
  readonly $textElem: DomElement

  readonly toolbarElemId: string
  readonly textElemId: string

  /**
   * 自定义配置
   */
  customConfig: {
    /**
     * 菜单配置
     */
    menus: string[]

    /**
     * 字体配置
     */
    fontNames: string[]

    /**
     * 颜色配置
     */
    colors: string[]

    /**
     * 表情
     */
    emotions: Array<
      | {
          /**
           * tab 的标题
           */
          title: string
          /**
           * 表情类型
           */
          type: 'emoji'
          /**
           * emoji 数组
           */
          content: string[]
        }
      | {
          /**
           * tab 的标题
           */
          title: string
          /**
           * 表情类型
           */
          type: 'image'
          /**
           * 图片对象 数组
           */
          content: Array<{
            /**
             * 图片地址
             */
            src: string
            /**
             * 图片缺省名称，例：[哈哈]
             */
            alt: string
          }>
        }
    >

    /**
     * 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出）
     */
    debug: boolean

    /**
     * 编辑区域的 z-index
     */
    zIndex: number
    lang: { [key: string]: string }
    pasteFilterStyle: boolean
    pasteIgnoreImg: boolean
    showLinkImg: boolean
    uploadImgMaxSize: number
    uploadImgShowBase64: boolean
    uploadFileName: boolean
    uploadImgParams: { [key: string]: string }
    withCredentials: boolean
    uploadImgTimeout: number

    /**
     * 是否上传七牛云，默认为 false
     */
    qiniu: boolean

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

class DomElement {
  constructor(selector: DomElement | Element | string)

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

  static offAll(): void
}

type Selector = string | Element | DomElement
type AttrVal = string | boolean | number
