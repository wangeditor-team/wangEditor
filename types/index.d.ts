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
     * 多语言
     */
    lang: { [key: string]: string }

    /**
     * 表情
     */
    emotions: Array<EmojiEmotions | ImageEmotions>

    /**
     * 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出），默认为 `false`
     */
    debug: boolean

    /**
     * 编辑区域的 z-index，默认为 `10000`
     */
    zIndex: number

    /**
     * 粘贴过滤样式，默认为 `true`
     */
    pasteFilterStyle: boolean

    /**
     * 粘贴内容时，忽略图片，默认为 `false`
     */
    pasteIgnoreImg: boolean

    /**
     * 是否显示添加网络图片的 tab，默认为 `true`
     */
    showLinkImg: boolean

    /**
     * 默认上传图片 max size，默认为 `5*1024*1024` 字节
     */
    uploadImgMaxSize: number

    /**
     * 上传图片，是否显示 base64 格式，默认为 `false`
     */
    uploadImgShowBase64: boolean

    /**
     * 自定义配置 filename
     */
    uploadFileName: boolean

    /**
     * 上传图片的自定义header
     */
    uploadImgParams: { [key: string]: string }

    /**
     * 配置 XHR withCredentials，默认为 `false`
     */
    withCredentials: boolean

    /**
     * 自定义上传图片超时时间 ms，默认为 `10000`
     */
    uploadImgTimeout: number

    /**
     * 是否上传七牛云，默认为 `false`
     */
    qiniu: boolean

    /**
     * 对粘贴的文字进行自定义处理，返回处理后的结果。编辑器会将处理后的结果粘贴到编辑区域中。
     * IE 暂时不支持
     * @param content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
     * @returns 处理后的结果
     */
    pasteTextHandle(content: string): string

    /**
     * 插入链接时候的格式校验
     * @param text 插入的文字
     * @param link 插入的链接
     * @returns 返回 `true` 即表示成功，返回 `'校验失败'` 表示失败的提示信息
     */
    linkCheck(text: string, link: string): boolean | string

    /**
     * 插入网络图片的校验
     * @param src 图片的地址
     * @returns 返回 `true` 即表示成功，返回 `'校验失败'` 表示失败的提示信息
     */
    linkImgCheck(src: string): boolean | string

    /**
     * 插入网络图片的回调
     * @param url 插入图片的地址
     */
    linkImgCallback(url: string): void

    /**
     * 用户操作（鼠标点击、键盘打字等）导致的内容变化之后触发
     * @param html 变化之后的内容
     */
    onchange(html: string): void

    /**
     * 用户点击富文本区域后触发
     */
    onfocus(): void

    /**
     * 富文本在焦点状态并且鼠标点击富文本以外的区域后触发
     * @param html 编辑器中的内容
     */
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
  find(selector: string): DomElement
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

interface EmojiEmotions {
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

interface ImageEmotions {
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