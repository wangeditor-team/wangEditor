/**
 * @description 自定义 elem
 * @author wangfupeng
 */

// ------------------------------------------ native-shim start ------------------------------------------

// 参考 https://github.com/webcomponents/custom-elements/blob/master/src/native-shim.js
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets new.target to the value of
 * this.constructor so that the native HTMLElement constructor can access the
 * current under-construction element's definition.
 */
;(function () {
  if (
    // No Reflect, no classes, no need for shim because native custom elements
    // require ES2015 classes or Reflect.
    window.Reflect === undefined ||
    window.customElements === undefined ||
    // The webcomponentsjs custom elements polyfill doesn't require
    // ES2015-compatible construction (`super()` or `Reflect.construct`).
    window.customElements.polyfillWrapFlushCallback
  ) {
    return
  }
  const BuiltInHTMLElement = HTMLElement
  /**
   * With jscompiler's RECOMMENDED_FLAGS the function name will be optimized away.
   * However, if we declare the function as a property on an object literal, and
   * use quotes for the property name, then closure will leave that much intact,
   * which is enough for the JS VM to correctly set Function.prototype.name.
   */
  const wrapperForTheName = {
    HTMLElement: /** @this {!Object} */ function HTMLElement() {
      return Reflect.construct(BuiltInHTMLElement, [], /** @type {!Function} */ this.constructor)
    },
  }
  window.HTMLElement = wrapperForTheName['HTMLElement']
  HTMLElement.prototype = BuiltInHTMLElement.prototype
  HTMLElement.prototype.constructor = HTMLElement
  Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement)
})()
// ------------------------------------------ native-shim end ------------------------------------------

// ------------------------------------------ 顶部导航 start ------------------------------------------
!(function () {
  // 当前语言
  const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'

  // 自定义组件
  class MyNav extends HTMLElement {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
      const document = shadow.ownerDocument

      const style = document.createElement('style')
      style.innerHTML = `
      .container {
        display: flex;
        padding: 10px;
        background-color: #4474c8;
        color: #fff;
      }
      .container a {
        color: #fff;
        text-decoration: none;
      }
      .container h1 {
        flex: 1;
        margin: 0;
        font-size: 26px;
      }
      .container .right-container {
        width: 200px;
        text-align: right;
        line-height: 26px;
      }
    `
      shadow.appendChild(style)

      // 容器
      const container = document.createElement('div')
      container.className = 'container'

      // 标题
      const header = document.createElement('h1')
      header.textContent = ''
      this.header = header

      // 右侧链接
      const rightContainer = document.createElement('div')
      rightContainer.className = 'right-container'
      if (LANG === 'en') {
        rightContainer.innerHTML = `
        <a href="https://www.wangeditor.com/en/">Document</a>
        &nbsp;
        <a href="https://github.com/wangeditor-team/wangEditor/tree/master/packages/editor/demo">Source</a>
      `
      } else {
        rightContainer.innerHTML = `
        <a href="https://www.wangeditor.com/">文档</a>
        &nbsp;
        <a href="https://github.com/wangeditor-team/wangEditor/tree/master/packages/editor/demo">源码</a>
      `
      }

      container.appendChild(header)
      container.appendChild(rightContainer)

      shadow.appendChild(container)
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'title') {
        if (oldValue == newValue) return
        this.header.textContent = newValue
      }
    }
  }
  MyNav.observedAttributes = ['title']
  window.customElements.define('demo-nav', MyNav)
})()
// ------------------------------------------ 顶部导航 end ------------------------------------------

// ------------------------------------------ 左侧菜单 start ------------------------------------------
// 菜单配置
const MENU_CONF = [
  {
    'zh-CN': { text: '默认模式', link: './index.html' },
    en: { text: 'Default mode', link: './index.html?lang=en' },
  },
  {
    'zh-CN': { text: '简洁模式', link: './simple-mode.html' },
    en: { text: 'Simple mode', link: './simple-mode.html?lang=en' },
  },
  {
    'zh-CN': { text: '获取 HTML', link: './get-html.html' },
    en: { text: 'Get HTML', link: './get-html.html?lang=en' },
  },
  {
    'zh-CN': { text: '设置 HTML', link: './set-html.html' },
    en: { text: 'Set HTML', link: './set-html.html?lang=en' },
  },
  {
    'zh-CN': { text: '模拟腾讯文档', link: './like-qq-doc.html' },
    en: { text: 'Like QQ doc', link: './like-qq-doc.html?lang=en' },
  },
  {
    'zh-CN': {
      text: '上传图片',
      link: 'https://github.com/wangeditor-team/server',
    },
    en: {
      text: 'Upload Image',
      link: 'https://github.com/wangeditor-team/server',
    },
  },
  {
    'zh-CN': {
      text: '上传视频',
      link: 'https://github.com/wangeditor-team/server',
    },
    en: {
      text: 'Upload Video',
      link: 'https://github.com/wangeditor-team/server',
    },
  },
  {
    'zh-CN': { text: '代码高亮', link: './code-highlight.html' },
    en: { text: 'Code highlight', link: './code-highlight.html?lang=en' },
  },
  {
    'zh-CN': { text: '多个编辑器', link: './multi-editor.html' },
    en: { text: 'Multi editor', link: './multi-editor.html?lang=en' },
  },
  {
    'zh-CN': { text: '标题目录', link: './catalog.html' },
    en: { text: 'Catalog', link: './catalog.html?lang=en' },
  },
  {
    'zh-CN': { text: 'Max Length', link: './max-length.html' },
    en: { text: 'Max Length', link: './max-length.html?lang=en' },
  },
  {
    'zh-CN': { text: '大文件 10w 字', link: './huge-doc.html' },
    en: { text: 'Huge doc', link: './huge-doc.html?lang=en' },
  },
  {
    'zh-CN': {
      text: 'Shadow DOM',
      link: 'https://github.com/wangeditor-team/wangEditor/blob/master/packages/editor/examples/shadow-dom.html',
    },
    en: {
      text: 'Shadow DOM',
      link: 'https://github.com/wangeditor-team/wangEditor/blob/master/packages/editor/examples/shadow-dom.html',
    },
  },
  {
    'zh-CN': { text: '扩展菜单 Button', link: './extend-menu.html' },
    en: { text: 'Extend Button menu', link: './extend-menu.html?lang=en' },
  },
  {
    'zh-CN': { text: '扩展菜单 select', link: './extend-menu-select.html' },
    en: { text: 'Extend select menu', link: './extend-menu-select.html?lang=en' },
  },
  {
    'zh-CN': { text: '扩展菜单 dropPanel', link: './extend-menu-drop-panel.html' },
    en: { text: 'Extend dropPanel menu', link: './extend-menu-drop-panel.html?lang=en' },
  },
  {
    'zh-CN': { text: '扩展菜单 modal', link: './extend-menu-modal.html' },
    en: { text: 'Extend modal menu', link: './extend-menu-modal.html?lang=en' },
  },
  {
    'zh-CN': { text: 'Vue2 demo', link: 'https://www.wangeditor.com/v5/for-frame.html#vue2' },
    en: { text: 'Vue2 demo', link: 'https://www.wangeditor.com/en/v5/for-frame.html#vue2' },
  },
  {
    'zh-CN': { text: 'Vue3 demo', link: 'https://www.wangeditor.com/v5/for-frame.html#vue3' },
    en: { text: 'Vue3 demo', link: 'https://www.wangeditor.com/en/v5/for-frame.html#vue3' },
  },
  {
    'zh-CN': {
      text: 'React demo',
      link: 'https://www.wangeditor.com/v5/for-frame.html#react',
    },
    en: {
      text: 'React demo',
      link: 'https://www.wangeditor.com/en/v5/for-frame.html#react',
    },
  },
  {
    'zh-CN': {
      text: 'Webpack demo',
      link: 'https://github.com/wangfupeng1988/webpack-wangeditor-demo',
    },
    en: { text: 'Webpack demo', link: 'https://github.com/wangfupeng1988/webpack-wangeditor-demo' },
  },
]

!(function () {
  // 当前语言
  const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'

  // 自定义组件
  class MyMenu extends HTMLElement {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
      const document = shadow.ownerDocument

      const style = document.createElement('style')
      style.innerHTML = `
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          margin: 0;
          margin-bottom: 18px;
        }
        a {
          color: #333;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `
      shadow.appendChild(style)

      const container = document.createElement('div')
      container.innerHTML = `<ul>
        ${MENU_CONF.map(item => {
          const { link, text } = item[LANG]
          return `<li><a href="${link}">${text}</a></li>`
        }).join('')}
      </ul>`

      shadow.appendChild(container)
    }
  }
  window.customElements.define('demo-menu', MyMenu)
})()
// ------------------------------------------ 左侧菜单 end ------------------------------------------
