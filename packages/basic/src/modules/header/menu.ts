/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { IMenuItem, IDomEditor } from '@wangeditor/core'

class HeaderMenu implements IMenuItem {
  title = '标题'
  iconSvg = `<svg t="1621560063901" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2154" width="200" height="200"><path d="M961.170286 950.857143q-25.161143 0-75.702857-1.974857t-76.288-1.974857q-25.161143 0-75.410286 1.974857t-75.410286 1.974857q-13.677714 0-21.138286-11.702857t-7.460571-25.965714q0-17.700571 9.728-26.258286t22.308571-9.728 29.110857-4.022857 25.746286-8.557714q18.870857-11.995429 18.870857-80.018286l-0.585143-223.451429q0-11.995429-0.585143-17.700571-7.460571-2.267429-28.598857-2.267429l-385.682286 0q-21.723429 0-29.110857 2.267429-0.585143 5.705143-0.585143 17.700571l-0.585143 211.968q0 81.115429 21.138286 93.696 9.142857 5.705143 27.428571 7.460571t32.548571 1.974857 25.746286 8.557714 11.410286 25.965714q0 14.848-7.168 27.428571t-20.845714 12.580571q-26.843429 0-79.725714-1.974857t-79.140571-1.974857q-24.576 0-73.142857 1.974857t-72.557714 1.974857q-13.165714 0-20.260571-11.995429t-7.168-25.746286q0-17.115429 8.850286-25.746286t20.553143-10.020571 27.136-4.315429 23.990857-8.557714q18.870857-13.165714 18.870857-81.700571l-0.585143-32.548571 0-464.603429q0-1.682286 0.292571-14.848t0-20.845714-0.877714-22.016-1.974857-23.990857-3.730286-20.845714-6.290286-17.993143-9.142857-10.313143q-8.557714-5.705143-25.746286-6.875429t-30.281143-1.170286-23.405714-7.972571-10.313143-25.746286q0-14.848 6.875429-27.428571t20.553143-12.580571q26.258286 0 79.140571 1.974857t79.140571 1.974857q23.990857 0 72.265143-1.974857t72.265143-1.974857q14.262857 0 21.430857 12.580571t7.168 27.428571q0 17.115429-9.728 24.868571t-22.016 8.265143-28.306286 2.267429-24.576 7.460571q-19.968 11.995429-19.968 91.428571l0.585143 182.857143q0 11.995429 0.585143 18.285714 7.460571 1.682286 22.308571 1.682286l399.433143 0q14.262857 0 21.723429-1.682286 0.585143-6.290286 0.585143-18.285714l0.585143-182.857143q0-79.433143-19.968-91.428571-10.313143-6.290286-33.426286-7.168t-37.741714-7.460571-14.555429-28.306286q0-14.848 7.168-27.428571t21.430857-12.580571q25.161143 0 75.410286 1.974857t75.410286 1.974857q24.576 0 73.728-1.974857t73.728-1.974857q14.262857 0 21.430857 12.580571t7.168 27.428571q0 17.115429-10.020571 25.161143t-22.820571 8.265143-29.403429 1.682286-25.161143 7.168q-19.968 13.165714-19.968 92.013714l0.585143 538.843429q0 68.022857 19.456 80.018286 9.142857 5.705143 26.258286 7.68t30.573714 2.56 23.698286 8.850286 10.313143 25.453714q0 14.848-6.875429 27.428571t-20.553143 12.580571z" p-id="2155" fill="#333333"></path></svg>`
  tag = 'select'
  width = 60
  options = [
    // value 和 elemNode.type 对应
    {
      value: 'header1',
      text: 'H1',
      styleForRenderMenuList: { 'font-size': '32px', 'font-weight': 'bold' },
    },
    {
      value: 'header2',
      text: 'H2',
      styleForRenderMenuList: { 'font-size': '24px', 'font-weight': 'bold' },
    },
    {
      value: 'header3',
      text: 'H3',
      styleForRenderMenuList: { 'font-size': '18px', 'font-weight': 'bold' },
    },
    { value: 'paragraph', text: '正文', selected: true },
  ]

  /**
   * 获取 node.type
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const [match] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        const { type = '' } = n
        return type.startsWith('header') // 匹配 node.type 是 header 开头的 node
      },
      universal: true,
    })

    // 未匹配到 header
    if (match == null) return 'paragraph'

    // 匹配到 header
    const [n] = match
    // @ts-ignore
    return n.type
  }
  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // 只可用于 p 和 header
        if (type === 'paragraph') return true
        if (type.startsWith('header')) return true

        return false
      },
      universal: true,
    })

    if (match) return false
    return true
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  cmd(editor: IDomEditor, value: string | boolean) {
    if (!value) return

    // @ts-ignore 修改 options ，修改 selected
    this.options = this.options.map(opt => {
      const { value: val, text, styleForRenderMenuList } = opt
      if (val === value) {
        // 选中的 opt
        return { value, text, styleForRenderMenuList, selected: true }
      }
      // 未选中的 opt
      return { value: val, text, styleForRenderMenuList }
    })

    // 执行命令
    Transforms.setNodes(editor, {
      // @ts-ignore
      type: value,
    })
  }
}

export default {
  key: 'header',
  factory() {
    return new HeaderMenu()
  },
}
